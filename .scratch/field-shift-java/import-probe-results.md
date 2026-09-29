# Java import probe: partial result

Run: 27 September 2026. Reproduce access checks with `python3 .scratch/field-shift-java/import-probe.py`, then value reads with `python3 .scratch/field-shift-java/import-sample-read.py` from the repo root. The [access manifest](./import-probe-manifest.json) records URLs, status codes, response sizes, elapsed request time, source names, sample bounds, and SHA-256 hashes of the three BIG GeoJSON responses. The [value-read result](./import-sample-read.json) records source bytes and sample values. Neither script writes to Neon. The bearer token stays in a local private file and is not copied into these results.

## Sample and measured access

I used three BIG June 2026 candidate polygons: Indramayu (`32.12.15`), Sleman (`34.04.13`), and Banyuwangi (`35.10.16`). These cover west coast, inland, and east Java contexts. All three BIG responses parsed as valid geometry. The three GeoJSON payloads were 65,907, 106,136, and 198,354 bytes. This small sample does not establish full Java geometry or topology quality. [BIG layer](https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KECAMATAN_AR/MapServer/0)

The probe period was **1–7 September 2026 UTC**. POWER returned HTTP 200 for all three centroid requests in 0.76–0.90 seconds each, with 1,035–1,039 response bytes. Temperature (`T2M`) and corrected rain (`PRECTOTCORR`) each had 7/7 non-fill days in every area. Solar irradiance (`ALLSKY_SFC_SW_DWN`) had **0/7** non-fill days in every area (`-999` fill). Thus a combined heat, rain, and solar value would be incomplete for this period. A centroid value is a source-cell value, not a polygon average. [POWER daily API](https://power.larc.nasa.gov/docs/services/api/temporal/daily/)

CMR metadata search found these candidate granules for the same time and bounding boxes:

| Source | Indramayu | Sleman | Banyuwangi | Actual value read? |
| --- | ---: | ---: | ---: | --- |
| IMERG Late V07 | 7 daily granules | 7 | 7 | Yes: one daily NetCDF4/HDF5 granule read after account approval. |
| SMAP SPL4SMGP V008 | 57 granules | 57 | 57 | Yes: one full HDF5 granule read. |
| HLS S30 v2 | 11 scenes | 1 | 7 | Yes: one B04 band and Fmask per area read. |

These are **discovery counts**, not valid cell or clear-pixel coverage. A CMR hit means a granule's search geometry and time match; it does not prove that the polygon has a valid source pixel. The probe tested one HLS sensor (S30), not L30. NASA's token method opened all three protected sources after the account owner accepted the GES DISC agreement. Before that approval, GES DISC returned 403, `EULA Acceptance Failure`, with a direct application approval link. [CMR search API](https://cmr.earthdata.nasa.gov/search/site/docs/search/api.html) · [Earthdata token download method](https://urs.earthdata.nasa.gov/documentation/for_users/data_access/python_user_token_script)

The first anonymous sequential probe took about 17 seconds. With the token and all approvals in place, the access probe took about 32 seconds. These times measure small HTTP requests, not a Java import. The GES DISC 403 before approval is a tested failure path; after approval, all three protected file headers returned HTTP 206 and valid HDF5 or TIFF bytes.

## Actual IMERG sample read

One IMERG Late V07C daily file was **32,462,912 bytes** and downloaded in **19.8 seconds**. The file has 0.1° longitude and latitude axes; its `precipitation` variable is in mm/day with a fill value. I intersected each BIG polygon with the source cells and checked the value and retrieval count in every overlapping cell. Indramayu overlapped four cells, Sleman two, and Banyuwangi two. All overlapping cells had a valid value and a daily retrieval count of 48. The area-weighted value for **1 September 2026** was **0 mm/day** in all three areas. This is one day of source coverage, not a test against local rain gauges or a reliable seven-day rain trend. [IMERG Late collection](https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGDL_07/summary)

## Actual SMAP and HLS sample reads

One SMAP global HDF5 granule was **150,059,341 bytes** and downloaded in **18.7 seconds**. Reading its coordinate and soil-moisture arrays took **0.9 seconds** on this machine. At the cell nearest each polygon centroid, surface/root-zone moisture was 0.087/0.157 m³/m³ for Indramayu, 0.181/0.221 for Sleman, and 0.174/0.238 for Banyuwangi. Only Indramayu had a SMAP **cell center inside** its polygon. The other two values describe nearby cells and cannot be called polygon values without an overlap rule. This is one three-hour snapshot, not a time-series quality test. [SMAP product](https://nsidc.org/data/spl4smgp/versions/8)

For one HLS S30 scene per area, I downloaded B04 reflectance and Fmask quality files. The six files totaled **76.7 MB**. The B04 and Fmask files together took 6–10 seconds per area to download; each polygon clip took under 0.2 seconds to read. I counted valid B04 pixels inside each polygon and then excluded pixels marked cloud, adjacent to cloud/shadow, cloud shadow, or snow/ice in Fmask bits 1–4. The HLS user guide defines those bits and the band fill values. [HLS v2 user guide](https://lpdaac.usgs.gov/documents/1698/HLS_User_Guide_V2.pdf)

| Area | Polygon pixels in one S30 scene | Valid B04 pixels | Clear pixels | Clear share |
| --- | ---: | ---: | ---: | ---: |
| Indramayu | 60,575 | 60,575 | 45,062 | 74.4% |
| Sleman | 34,678 | 34,678 | 2,674 | 7.7% |
| Banyuwangi | 9,414 | 9,414 | 9,375 | 99.6% |

This is a useful failure case: the first Sleman scene has many valid pixels but little clear coverage. A multi-date indicator must check enough scenes before it treats a missing clear view as a land signal. These counts do not verify crop type, and B04 alone does not form a vegetation index.

## Size and cost bounds for planning

- The first CMR entries report about **32.5 MB** for one whole IMERG Late daily granule and **150 MB** for one whole SMAP three-hour granule. Downloading whole global granules for a year would be roughly **12 GB IMERG** and **438 GB SMAP** before copies or retries. A Java subset should be far smaller, but the subset size and request cost are not measured. The HLS metadata in this run did not give a useful scene-byte value.
- For a **weekly, seven-day S30-only refresh scenario**, a broad Java bounding-box [S30 CMR query](https://cmr.earthdata.nasa.gov/search/granules.json?short_name=HLSS30&version=2.0&bounding_box=105.2,-9.2,114.8,-5.6&temporal=2026-09-01T00:00:00Z,2026-09-07T23:59:59Z&page_size=1) found **98 S30 scenes** for 1–7 September 2026. An [L30 query](https://cmr.earthdata.nasa.gov/search/granules.json?short_name=HLSL30&version=2.0&bounding_box=105.2,-9.2,114.8,-5.6&temporal=2026-09-01T00:00:00Z,2026-09-07T23:59:59Z&page_size=1) found 62 more scenes, which this scenario excludes. Seven full daily IMERG files, 56 full three-hour SMAP files, and 98 S30 B04/Fmask pairs at the three-scene mean of 25.6 MB imply about **11.1 GB of source transfer per weekly run**, or **579 GB per year** at 52 identical weeks. Repeating the measured sequential transfer times gives about **32 minutes per run before raster work, retries, or publication**. This is a planning scenario, not a measured Java-wide run: the broad box includes areas beyond Java, source sizes vary, and files can be subset or cached.
- At the prior check, BIG returned **2,146 coded kecamatan** across six Java provinces. A deliberately broad storage model of four daily source-summary rows per area gives **3,133,160 rows per year**. At an assumed 0.25–1 KB per row, that is **0.8–3.1 GB** before indexes, revisions, and database overhead. This is an assumption for budget sizing, not a measured database size. [Boundary count check](../../docs/research/java-kecamatan-boundaries.md)
- At Neon's published **$0.35 per GB-month** storage rate, that assumed row storage alone would be about **$0.28–$1.10 per month** once a year is retained. Compute, historical revisions, indexes, tiles, processing host, traffic, and backups can cost more. The provider's published Launch compute rate is **$0.106 per CU-hour**; a cost estimate for the import job needs measured CU-hours and source subset volume. [Neon pricing explanation](https://neon.com/blog/major-compute-price-reduction-on-neon)

For the planned **operator-started first release**, the only incremental bill that this probe can price is the assumed Neon summary storage: **$0.28–$1.10 per month** for the broad daily-row model. Running the batch on an existing operator machine avoids a separate cloud batch bill, but still uses that machine, its network, and staff time. Public tile hosting and web/database compute are not included. Therefore this is a **partial operating-cost projection**, not an all-in service quote. The weekly transfer scenario above is the input for choosing a runner and network budget before a maintained refresh is set.

## Required follow-up before a published Java import

1. Test multi-date IMERG and SMAP coverage, and enough HLS S30 scenes to handle clouds. Add HLS L30 if it is part of the first-release indicator. The present reads show one day or scene per source, not a screening time series.
2. Define a SMAP cell-overlap rule before attaching a value to a small kecamatan. Two of the three samples have no source-cell center inside their polygon.
3. Run one small write to a disposable database or local PostgreSQL with a proposed summary row, then measure row and index sizes. Scale the measured work to the 2,146-area candidate count with a stated refresh period and hosting price. Do not use the 17-second HTTP probe as a Java processing estimate.
4. Freeze and validate the full BIG boundary snapshot before import. Its public tile reuse rights are tracked by [Clear reuse rights for BIG kecamatan boundaries](./issues/18-clear-big-boundary-reuse-rights.md).

The present result proves an accessible boundary and partial POWER path, plus actual IMERG, SMAP, and HLS sample values. It does **not** prove a full Java import, multi-date source coverage, or total operating cost.
