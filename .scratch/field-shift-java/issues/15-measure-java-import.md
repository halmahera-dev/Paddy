# Measure the Java-wide NASA import path

Type: `task`  
Status: resolved  
Assignee: heritsam  
Parent: [Field Shift Java decision map](../map.md)
Blocked by: 14

## Question

Run a small, repeatable import test on representative Java *kecamatan* using the chosen boundary release and authenticated source access where needed. Test IMERG, POWER, SMAP, and HLS pixel or cell reads; measure valid coverage, data volume, processing time, failure handling, and projected Java-wide storage and operating cost. Save a source manifest and record which steps still need credentials or partner access. This test supplies facts for the release plan; it does not claim that the full Java-wide import has run.

## Progress, 27 September 2026

The [repeatable probe](../import-probe.py), [source manifest](../import-probe-manifest.json), and [measured result](../import-probe-results.md) cover three BIG kecamatan, POWER values, CMR discovery, and protected-file access. IMERG, SMAP, and HLS file reads reached Earthdata Login and returned 401 because this environment has no NASA Earthdata credential. The probe now accepts a local bearer token from `~/.config/field-shift-java/earthdata-token` or `EARTHDATA_TOKEN`. Actual cell and pixel coverage, processing time, and operating cost remain unmeasured. This ticket stays open until the protected reads and bounded processing test are complete.

With a bearer token, the [sample reader](../import-sample-read.py) read one SMAP HDF5 granule and one HLS B04/Fmask scene for each sample area. The [value-read result](../import-sample-read.json) records bytes, time, and quality counts. IMERG returned 403, `EULA Acceptance Failure`; the account owner must review that agreement. Multi-date coverage, import storage, and full cost remain open. The [report](../import-probe-results.md) has the measured limits.

The account owner accepted the GES DISC agreement. The next retry returned IMERG data, and the sample reader measured rain cells for all three areas. The [manifest](../import-probe-manifest.json) now shows HTTP 206 and valid file headers for IMERG, SMAP, and HLS.

## Answer

The small source-read path works for three representative BIG kecamatan. POWER yielded seven days of temperature and rain, but no solar values for the tested week. One IMERG daily file had valid rain values in every cell overlapping the three areas. One SMAP granule supplied valid nearby soil-moisture cells, but two small kecamatan had no cell center inside them. One HLS S30 scene per area yielded clear B04 coverage of 74.4%, 7.7%, and 99.6%, showing why scene discovery alone cannot establish usable coverage. The [report](../import-probe-results.md) and [value-read result](../import-sample-read.json) record source versions, bytes, times, quality flags, and tested failure paths.

A broad-box, S30-only weekly transfer scenario is about 11.1 GB and 32 minutes of sequential download time before processing; it is an extrapolation, not a Java import measurement. A broad daily-summary storage model gives 0.8–3.1 GB per retained year and about $0.28–$1.10 per month in Neon storage at the checked rate. Total service cost depends on the runner, tile host, database work, and refresh policy. Keep those as release-planning gates. This task tested a bounded source path; it did not publish Java-wide data.
