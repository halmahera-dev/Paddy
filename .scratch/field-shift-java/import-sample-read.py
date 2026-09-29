"""Read one SMAP granule and one HLS S30 scene per sample area."""

import json
import os
import tempfile
import time
from pathlib import Path

import h5py
import numpy as np
import rasterio
import requests
from rasterio.features import geometry_mask
from rasterio.mask import mask
from rasterio.warp import transform_geom
from shapely import contains_xy
from shapely.geometry import box, mapping, shape


ROOT = Path(__file__).parent
MANIFEST = json.loads((ROOT / "import-probe-manifest.json").read_text())
OUTPUT = ROOT / "import-sample-read.json"
BOUNDARY_URL = "https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KECAMATAN_AR/MapServer/0/query"


def earthdata_token():
    token = os.environ.get("EARTHDATA_TOKEN", "").strip()
    if not token:
        token = (Path.home() / ".config" / "field-shift-java" / "earthdata-token").read_text().strip()
    return token


def download(session, url, path, limit):
    started = time.monotonic()
    size = 0
    with session.get(url, headers={"Authorization": f"Bearer {earthdata_token()}"}, stream=True, timeout=90) as response:
        response.raise_for_status()
        with path.open("wb") as output:
            for chunk in response.iter_content(1024 * 1024):
                size += len(chunk)
                if size > limit:
                    raise RuntimeError(f"Data file exceeds {limit} byte cap")
                output.write(chunk)
    return {"bytes": size, "seconds": round(time.monotonic() - started, 3)}


def geometry(session, code):
    response = session.get(BOUNDARY_URL, params={
        "where": f"KDCPUM='{code}'", "outFields": "KDCPUM", "outSR": 4326, "f": "geojson"
    }, timeout=30)
    response.raise_for_status()
    return shape(response.json()["features"][0]["geometry"])


def read_smap(path, areas):
    result = {}
    started = time.monotonic()
    with h5py.File(path) as source:
        latitudes = source["cell_lat"][:]
        longitudes = source["cell_lon"][:]
        surface = source["Geophysical_Data/sm_surface"]
        rootzone = source["Geophysical_Data/sm_rootzone"]
        for area in areas:
            polygon = area["geometry"]
            x, y = polygon.centroid.x, polygon.centroid.y
            nearest = np.argmin((longitudes - x) ** 2 + (latitudes - y) ** 2)
            row, col = np.unravel_index(nearest, latitudes.shape)
            west, south, east, north = polygon.bounds
            candidates = np.where((longitudes >= west) & (longitudes <= east)
                                  & (latitudes >= south) & (latitudes <= north))
            inside = contains_xy(polygon, longitudes[candidates], latitudes[candidates])
            value = {
                "nearest_cell": [int(row), int(col)],
                "nearest_cell_center": [float(longitudes[row, col]), float(latitudes[row, col])],
                "cell_centers_inside_polygon": int(np.count_nonzero(inside)),
                "nearest_surface_m3_m3": float(surface[row, col]),
                "nearest_rootzone_m3_m3": float(rootzone[row, col]),
            }
            result[area["name"]] = value
    return result, round(time.monotonic() - started, 3)


def read_imerg(path, areas):
    result = {}
    started = time.monotonic()
    with h5py.File(path) as source:
        longitudes = source["lon"][:]
        latitudes = source["lat"][:]
        rain = source["precipitation"]
        sample_count = source["precipitation_cnt"]
        fill = float(rain.attrs["_FillValue"][0])
        half_lon = abs(float(longitudes[1] - longitudes[0])) / 2
        half_lat = abs(float(latitudes[1] - latitudes[0])) / 2
        for area in areas:
            polygon = area["geometry"]
            west, south, east, north = polygon.bounds
            lon_indices = np.where((longitudes >= west - half_lon) & (longitudes <= east + half_lon))[0]
            lat_indices = np.where((latitudes >= south - half_lat) & (latitudes <= north + half_lat))[0]
            cells = []
            for lon_index in lon_indices:
                for lat_index in lat_indices:
                    x, y = float(longitudes[lon_index]), float(latitudes[lat_index])
                    overlap = polygon.intersection(box(x - half_lon, y - half_lat, x + half_lon, y + half_lat))
                    if overlap.area <= 0:
                        continue
                    cells.append({
                        "center": [x, y],
                        "polygon_share": overlap.area / polygon.area,
                        "rain_mm_day": float(rain[0, lon_index, lat_index]),
                        "sample_count": int(sample_count[0, lon_index, lat_index]),
                    })
            valid = [cell for cell in cells if np.isfinite(cell["rain_mm_day"]) and cell["rain_mm_day"] != fill]
            valid_share = sum(cell["polygon_share"] for cell in valid)
            result[area["name"]] = {
                "overlap_cells": len(cells),
                "valid_polygon_share": valid_share,
                "area_weighted_rain_mm_day": (
                    sum(cell["polygon_share"] * cell["rain_mm_day"] for cell in valid) / valid_share
                    if valid_share else None
                ),
                "cells": cells,
            }
    return result, round(time.monotonic() - started, 3)


def hls_links(session, search_url):
    response = session.get(search_url, timeout=30)
    response.raise_for_status()
    entry = response.json()["feed"]["entry"][0]
    links = [item["href"] for item in entry["links"] if item.get("href", "").startswith("https://")]
    return entry["title"], {
        suffix: next(link for link in links if link.endswith(suffix) and "prod-protected" in link)
        for suffix in (".B04.tif", ".Fmask.tif")
    }


def read_hls(band_path, fmask_path, polygon):
    started = time.monotonic()
    with rasterio.open(band_path) as band, rasterio.open(fmask_path) as quality:
        projected = transform_geom("EPSG:4326", band.crs, mapping(polygon))
        band_data, transform = mask(band, [projected], crop=True, filled=True)
        quality_data, quality_transform = mask(quality, [projected], crop=True, filled=True)
        if band_data.shape != quality_data.shape or transform != quality_transform:
            raise RuntimeError("HLS band and quality grid do not align")
        inside = geometry_mask([projected], out_shape=band_data.shape[1:], transform=transform, invert=True)
        valid = inside & (band_data[0] != band.nodata) & (quality_data[0] != quality.nodata)
        clear = valid & ((quality_data[0] & 0b00011110) == 0)
        result = {
            "polygon_pixels": int(np.count_nonzero(inside)),
            "valid_pixels": int(np.count_nonzero(valid)),
            "clear_pixels": int(np.count_nonzero(clear)),
            "band_nodata": band.nodata,
            "quality_nodata": quality.nodata,
        }
    return result, round(time.monotonic() - started, 3)


def main():
    output = {"period": MANIFEST["period"], "areas": {}}
    with requests.Session() as session, tempfile.TemporaryDirectory(prefix="field-shift-import-") as folder:
        areas = [{"name": item["name"], "geometry": geometry(session, item["kdcpum"]), "search": item["hls_search"]["url"]}
                 for item in MANIFEST["areas"]]
        smap_path = Path(folder) / "smap.h5"
        output["smap_download"] = download(session, MANIFEST["file_access"]["smap"]["source_url"], smap_path, 180_000_000)
        smap_values, output["smap_read_seconds"] = read_smap(smap_path, areas)
        smap_path.unlink()
        imerg_path = Path(folder) / "imerg.nc4"
        output["imerg_download"] = download(session, MANIFEST["file_access"]["imerg_late"]["source_url"], imerg_path, 40_000_000)
        imerg_values, output["imerg_read_seconds"] = read_imerg(imerg_path, areas)
        imerg_path.unlink()
        for area in areas:
            name = area["name"]
            scene, links = hls_links(session, area["search"])
            band_path = Path(folder) / f"{name}-B04.tif"
            fmask_path = Path(folder) / f"{name}-Fmask.tif"
            band_transfer = download(session, links[".B04.tif"], band_path, 100_000_000)
            quality_transfer = download(session, links[".Fmask.tif"], fmask_path, 100_000_000)
            hls_values, read_seconds = read_hls(band_path, fmask_path, area["geometry"])
            output["areas"][name] = {
                "smap": smap_values[name],
                "imerg": imerg_values[name],
                "hls_scene": scene,
                "hls_band_download": band_transfer,
                "hls_quality_download": quality_transfer,
                "hls_read_seconds": read_seconds,
                "hls": hls_values,
            }
            band_path.unlink()
            fmask_path.unlink()
    OUTPUT.write_text(json.dumps(output, indent=2) + "\n")
    print(f"Saved {OUTPUT}")
    for name, area in output["areas"].items():
        print(name, "IMERG valid share", round(area["imerg"]["valid_polygon_share"], 3),
              "SMAP centers inside", area["smap"]["cell_centers_inside_polygon"],
              "HLS valid/clear", area["hls"]["valid_pixels"], area["hls"]["clear_pixels"])


if __name__ == "__main__":
    main()
