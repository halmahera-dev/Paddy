# 2025 Farm Navigators resources for the 2026 Java rotation tool

Checked: 1 October 2026. Scope: [the current PRD](../prd-government-landowners.md). This note does not use the scratch project.

The [2025 NASA Farm Navigators resource page](https://www.spaceappschallenge.org/2025/challenges/nasa-farm-navigators-using-nasa-data-exploration-in-agriculture/?tab=resources) has useful data tools and sources. We checked its full resource text through the site's public page API and the shared browser. The choices below are our assessment of fit to the PRD, not new challenge requirements.

## Decision

Keep IMERG, POWER, and SMAP as the MVP data sources. The most useful new item is **AppEEARS as a SMAP preparation path**. Use **Giovanni to check rain totals and units**. Keep **GFSAD as an optional old cropland check** and **GLAM as a later vegetation layer**. A catalog or map tool is not a new dataset.

## Resources listed on the 2025 challenge page

| Resource | Coverage, scale, date, and access | Fit to the current PRD |
| --- | --- | --- |
| [Agriculture and Water Management Pathfinder](https://www.earthdata.nasa.gov/learn/pathfinders/agricultural-and-water-resources-data-pathfinder) | The old URL now leads to NASA's Agriculture Production topic page. It gives routes to datasets, tools, and training. It is a guide, with no single grid or date range. | Use for source discovery. The PRD already has rain, weather, and soil moisture. Choose a named product before adding any other source. |
| [AppEEARS](https://appeears.earthdatacloud.nasa.gov/) | Point and area samples by dates and layers. Its [API](https://appeears.earthdatacloud.nasa.gov/api/) uses Earthdata Login for task access. The public [product list](https://appeears.earthdatacloud.nasa.gov/api/product) returned HTTP 200 on the check date. `SPL4SMGP.008` is available, with 9,000 m output metadata, a daily interval, and dates from 31 March 2015 to present. | **MVP preparation tool.** Test a small Java SMAP sample first. Then use it for the current root-zone moisture summary if the layers and dates meet the need. Native SMAP L4 is 3-hourly; check how AppEEARS forms its daily output before calculating a normal or anomaly. No authenticated task was run in this review. |
| [Giovanni](https://giovanni.gsfc.nasa.gov/giovanni/) | Analysis tool for selected NASA products. Scale and dates depend on the selected collection. The [manual](https://giovanni.gsfc.nasa.gov/giovanni/doc/UsersManualworkingdocument.docx.html) supports area time series, maps, and data exports. Full access needs Earthdata Login and GES DISC approval. | **MVP preparation check.** Compare a few IMERG monthly totals with our script. Keep the existing BIG polygon method for production; do not assume a tool's region average uses the same cell weights. |
| [GFSAD map](https://croplands.org/app/map) → `GFSAD30SEACE.001` | Southeast and Northeast Asia, including Java. Static cropland extent at about 30 m, nominal year 2015. GeoTIFF; discover files through [Earthdata Search](https://search.earthdata.nasa.gov/search/granules?p=C2763261715-LPCLOUD). The [USGS guide](https://lpdaac.usgs.gov/documents/1378/GFSAD30SEACE_User_Guide_V1.pdf) defines water/no-data, non-cropland, and cropland including fallow. | **Optional preparation check.** Compare a few FTW samples with old cropland extent. Do not block field selection with this old mask. It does not give current rice, maize, soybean, crop history, soil type, or legal field limits. |
| [GLAM](https://glam1.gsfc.nasa.gov/) | Global NDVI imagery and time series. The challenge calls it mainly MODIS. The current [official About page](https://glam1.gsfc.nasa.gov/api/doc/about) instead lists S-NPP/NOAA-20 VIIRS at 500 m every 8 days and Sentinel-3 OLCI at 300 m every 10 days. It lists public time-series and plot APIs. | **Later area vegetation context.** Pick and record the sensor, product, dates, and crop mask before use. Test Java region coverage. NDVI alone cannot identify a crop, prove a rotation, or measure soil health. Current Java series access was not tested. |
| [NASA Harvest](https://www.nasaharvest.org/) and [Harvest Portal](https://www.harvestportal.org/) | A global agriculture program and a catalog of agricultural data. The challenge describes searchable datasets, services, and metadata. These are not one Java crop dataset. | **Discovery only for now.** A crop table found here must have Java coverage, dates, labels, and terms checked before it enters the plan logic. |
| [ARSET agriculture training](https://appliedsciences.nasa.gov/what-we-do/capacity-building/arset/arset-agriculture-trainings) | Training on agriculture and remote sensing. No data grid or update cycle. | **Preparation support.** Use to check methods and limits; it adds no user feature. |
| [Earthdata Search](https://search.earthdata.nasa.gov/search), [Worldview](https://worldview.earthdata.nasa.gov/), and [VEDA](https://www.earthdata.nasa.gov/dashboard/) | Discovery, map, and analysis tools. Coverage and dates depend on the dataset. | **Preparation support.** Use to find data and check maps. Keep data reads out of app requests, as the PRD requires. |

Source facts in this table come from the linked first-party pages. Scope choices and stated limits on what the data can prove are our assessment against the PRD.

### Two checks that matter now

**IMERG monthly units:** precipitation rate is not a monthly total. NASA's [GES DISC answer](https://forum.earthdata.nasa.gov/viewtopic.php?p=22809) says to multiply mm/hour by 24 and by the month's day count. Giovanni has a unit conversion for checking this. Save the raw unit and the conversion with each total. Use only full seasons in the normal; NASA's [IMERG transition notice](https://gpm.nasa.gov/data/news/imerg-v08-transition-schedule) and [August 2026 update](https://gpm.nasa.gov/data/news/update-imerg-v08-transition-schedule-aug-2026) affect the available Final-run years.

**GLAM sensor change:** the 2025 resource description does not fix today's product. NASA's [Earthdata announcement](https://www.earthdata.nasa.gov/topics/human-dimensions/agriculture-production) warns that Suomi NPP data delivery ends on 1 November 2026. This is before the PRD's hackathon date. A later GLAM pilot should test NOAA-20 first and record the exact collection.

## Listed resources that do not fit the Java MVP

- **NASA Acres:** the challenge describes this program as focused on U.S. agriculture. Use methods where relevant, but verify Java coverage for any data separately. [NASA Acres](https://www.nasaacres.org/)
- **U.S. Drought Monitor and Crop-CASMA:** exclude from the Java data path. The former maps U.S. drought; USDA lists the latter's extent as the conterminous U.S. [Drought Monitor](https://droughtmonitor.unl.edu/) · [USDA Crop-CASMA metadata](https://www.nass.usda.gov/Research_and_Science/Cropland/metadata/metadata_cropcasma.htm)
- **Flood and heat pathfinders:** keep as later research routes. The MVP compares seasonal rain cover; it has no validated flood or heat-risk rule. [Floods](https://www.earthdata.nasa.gov/learn/pathfinders/disasters/floods-data-pathfinder) · [Heat](https://www.earthdata.nasa.gov/topics/human-dimensions/heat)
- **CSA radar and CONAE resources:** not needed by the present MVP. The challenge's RCM link points to the same RADARSAT-1 page as its RADARSAT-1 link. Check mission and coverage before any future use. The challenge describes CONAE's SAOCOM mosaic downloads by Argentine province; this does not establish Java access. [CSA linked portal](https://donnees-data.asc-csa.gc.ca/en/dataset/radarsat1) · [CONAE SAOCOM catalog](https://catalogos.conae.gov.ar/catalogo/catalogoSaocom.html)

## Extra product option and search terms

**MOD16 is an extra product option, not a direct product link on the challenge page.** AppEEARS currently lists `MOD16A2.061` as available: 500 m, 8-day ET and latent heat, from 2021 to present. The [MOD16 guide](https://www.earthdata.nasa.gov/s3fs-public/2025-04/MOD16_User_Guide_V61.pdf) explains the model. It could support a later check on area water use. It does not replace reference ETo in the PRD's crop-coefficient calculation. Actual ET and reference ETo are different quantities; using actual ET as that denominator would change the method.

The challenge also gives **search keywords**, not ready Java integrations: earthaccess, OpenET, CropHarvest, Zenodo, and FAO/NASA Harvest public crop-type datasets. Treat each as a route to further checks. Do not count a search term as a verified dataset or evidence of Java coverage.

## Next preparation step

Run one AppEEARS task for `SPL4SMGP.008` in a Java test area. Check the root-zone layer, daily output method, missing values, returned dates, and units. Compare one small IMERG area in Giovanni with the offline calculation. These checks improve the existing data path without adding a new product feature.
