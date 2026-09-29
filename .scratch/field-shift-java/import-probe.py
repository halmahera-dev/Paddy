"""Small, repeatable Java source access probe. Run: python3 import-probe.py."""

import hashlib
import json
import netrc
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import requests
from shapely.geometry import shape


AREAS = {
    "Indramayu": "32.12.15",
    "Sleman": "34.04.13",
    "Banyuwangi": "35.10.16",
}
START = "2026-09-01"
END = "2026-09-07"
BOUNDARY_URL = "https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KECAMATAN_AR/MapServer/0/query"
CMR_URL = "https://cmr.earthdata.nasa.gov/search/granules.json"
POWER_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"
OUTPUT = Path(__file__).with_name("import-probe-manifest.json")


def get(session, url, params=None, headers=None):
    start = time.monotonic()
    try:
        response = session.get(url, params=params, headers=headers, timeout=35)
        elapsed = round(time.monotonic() - start, 3)
        result = {
            "url": response.url,
            "status": response.status_code,
            "seconds": elapsed,
            "response_bytes": len(response.content),
        }
        return response, result
    except requests.RequestException as error:
        return None, {"url": url, "seconds": round(time.monotonic() - start, 3), "error": str(error)}


def metadata_links(entry):
    return [link["href"] for link in entry.get("links", []) if link.get("href", "").startswith("https://")]


def probe_area(session, name, code):
    result = {"name": name, "kdcpum": code}
    response, request = get(session, BOUNDARY_URL, {
        "where": f"KDCPUM='{code}'",
        "outFields": "KDCPUM,NAMOBJ,KDPPUM,WADMKK",
        "outSR": 4326,
        "f": "geojson",
    })
    result["boundary_request"] = request
    if response is None or response.status_code != 200:
        return result
    try:
        feature = response.json()["features"][0]
        geometry = shape(feature["geometry"])
        result["boundary"] = {
            "name": feature["properties"].get("NAMOBJ"),
            "valid": geometry.is_valid,
            "bounds": list(geometry.bounds),
            "centroid": [geometry.centroid.x, geometry.centroid.y],
            "sha256": hashlib.sha256(response.content).hexdigest(),
        }
    except (KeyError, IndexError, ValueError) as error:
        result["boundary_error"] = str(error)
        return result

    longitude, latitude = result["boundary"]["centroid"]
    response, request = get(session, POWER_URL, {
        "parameters": "T2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN",
        "community": "AG",
        "longitude": round(longitude, 5),
        "latitude": round(latitude, 5),
        "start": START.replace("-", ""),
        "end": END.replace("-", ""),
        "time-standard": "UTC",
        "format": "JSON",
    })
    result["power_request"] = request
    if response is not None and response.status_code == 200:
        try:
            data = response.json()
            parameters = data["properties"]["parameter"]
            result["power"] = {
                "parameter": {
                    key: {
                        "days": len(values),
                        "valid_days": sum(value not in (-999, -999.0, None) for value in values.values()),
                        "first_value": next(iter(values.values())),
                    }
                    for key, values in parameters.items()
                },
                "fill_value": data.get("header", {}).get("fill_value"),
            }
        except (KeyError, ValueError) as error:
            result["power_error"] = str(error)

    west, south, east, north = result["boundary"]["bounds"]
    for source, short_name, version in (
        ("imerg_late", "GPM_3IMERGDL", "07"),
        ("smap", "SPL4SMGP", "008"),
        ("hls", "HLSS30", "2.0"),
    ):
        response, request = get(session, CMR_URL, {
            "short_name": short_name,
            "version": version,
            "bounding_box": f"{west},{south},{east},{north}",
            "temporal": f"{START}T00:00:00Z,{END}T23:59:59Z",
            "page_size": 1,
        })
        result[f"{source}_search"] = request
        if response is None or response.status_code != 200:
            continue
        try:
            entries = response.json()["feed"]["entry"]
            result[source] = {
                "cmr_hits": int(response.headers.get("CMR-Hits", "0")),
                "first_granule": entries[0].get("title") if entries else None,
                "first_granule_bytes": round(float(entries[0].get("granule_size", 0)) * 1024 * 1024) if entries else None,
                "links": metadata_links(entries[0])[:4] if entries else [],
            }
        except (KeyError, ValueError) as error:
            result[f"{source}_error"] = str(error)
    return result


def probe_file_access(session, areas):
    probes = {}
    first = areas[0]
    token = os.environ.get("EARTHDATA_TOKEN", "").strip()
    token_path = Path.home() / ".config" / "field-shift-java" / "earthdata-token"
    if not token and token_path.exists():
        token = token_path.read_text().strip()
    for source, suffix in (("imerg_late", ".nc4"), ("smap", ".h5"), ("hls", ".B04.tif")):
        links = first.get(source, {}).get("links", [])
        url = next((link for link in links if link.endswith(suffix)), None)
        if url is None and source == "hls":
            url = next((link for link in links if link.endswith(".tif")), None)
        if url is None:
            probes[source] = {"error": "No matching data link in first CMR entry"}
            continue
        started = time.monotonic()
        try:
            headers = {"Range": "bytes=0-3"}
            if token:
                headers["Authorization"] = f"Bearer {token}"
            with session.get(url, headers=headers, timeout=20, stream=True) as response:
                sample = response.raw.read(4)
                probes[source] = {
                    "source_url": url,
                    "status": response.status_code,
                    "redirect_statuses": [item.status_code for item in response.history],
                    "final_host": urlparse(response.url).hostname,
                    "content_type": response.headers.get("Content-Type"),
                    "content_range": response.headers.get("Content-Range"),
                    "first_bytes_hex": sample.hex(),
                    "file_header_valid": sample in (
                        b"\x89HDF", b"II*\x00", b"II+\x00", b"MM\x00*", b"MM\x00+"
                    ),
                    "seconds": round(time.monotonic() - started, 3),
                }
        except requests.RequestException as error:
            probes[source] = {"source_url": url, "error": str(error), "seconds": round(time.monotonic() - started, 3)}
    return probes


def main():
    try:
        has_earthdata_netrc = "urs.earthdata.nasa.gov" in netrc.netrc(os.path.expanduser("~/.netrc")).hosts
    except (FileNotFoundError, netrc.NetrcParseError):
        has_earthdata_netrc = False
    with requests.Session() as session:
        session.headers["User-Agent"] = "field-shift-java-import-probe/1.0"
        started = time.monotonic()
        areas = [probe_area(session, name, code) for name, code in AREAS.items()]
        file_access = probe_file_access(session, areas)
    manifest = {
        "run_utc": datetime.now(timezone.utc).isoformat(),
        "elapsed_seconds": round(time.monotonic() - started, 3),
        "boundary_release": "BIG BATAS_KECAMATAN_AR_2026 (June 2026 candidate)",
        "period": [START, END],
        "earthdata_netrc_entry_present": has_earthdata_netrc,
        "earthdata_token_present": bool(os.environ.get("EARTHDATA_TOKEN") or (Path.home() / ".config" / "field-shift-java" / "earthdata-token").exists()),
        "areas": areas,
        "file_access": file_access,
    }
    OUTPUT.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    print(f"Saved {OUTPUT}")
    for area in areas:
        print(area["name"], area.get("boundary_request", {}).get("status"),
              area.get("power_request", {}).get("status"),
              [(source, area.get(source, {}).get("cmr_hits")) for source in ("imerg_late", "smap", "hls")])


if __name__ == "__main__":
    main()
