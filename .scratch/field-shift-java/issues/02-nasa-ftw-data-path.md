# Verify the NASA and FTW data path

Type: `research`  
Status: resolved  
Parent: [Field Shift Java decision map](../map.md)

## Question

Which actual access path can supply a Java field map and a pilot-zone time series without downloading whole-country files into the browser? Verify FTW PMTiles and GeoParquet access, and NASA IMERG, POWER, HLS, and SMAP access and recent-data status. Record formats, authentication, source scale, units, latency, request limits, and a small test request where practical. Decide which sources a first working proof can read reliably and which need a prepared subset.

## Answer

Use FTW PMTiles directly for the browser map and a small server-side FTW GeoParquet subset for pilot analysis. NASA POWER's public daily point API works now for a pilot climate time series. Prepare IMERG, HLS and SMAP pilot-zone subsets in an authenticated batch job; public metadata search works, but their science files need Earthdata access. IMERG Final V07 stops at September 2025, while newer Late data exists and must keep its run/version label. Full evidence, tested requests, units, scale and limits: [Java NASA and FTW data path](../../../docs/research/java-nasa-ftw-data-path.md).
