# NASA-first farm metric options

Research date: 2 October 2026. Product reference: [government and landowners PRD](../prd-government-landowners.md). The agreed first-version choices are now in the PRD, including authenticated saved farms, crop records, rough or unknown planting dates, in-app alerts, AI explanations, and an illustrated 3D farm. Later options in this note do not expand that scope.

This is a practical inventory for crop rotation and monitoring in Java. It covers metric families and useful variants. It does not list every science variable in every NASA collection. Recommendations below are product choices, not NASA advice.

## Data scale and update limits

| Source | What it provides | Scale and time limits |
| --- | --- | --- |
| [IMERG](https://gpm.nasa.gov/data/imerg) | Satellite-based rain estimates, with gauge adjustments that depend on the run | About 0.1 degree. Half-hourly, daily, and monthly products. Early is about 4 hours behind observations; Late about 12–14 hours. Final takes months. Use Final for historical analysis and test a low-latency run for monitoring. Record product version and run. |
| [SMAP L4 SPL4SMGP](https://nsidc.org/data/SPL4SMGP/versions/8) | Surface and root-zone moisture estimates from a land model that uses satellite observations | 9 km, 3-hourly. This is an area model estimate. The [latency table](https://nsidc.org/data/user-resources/help-center/what-are-latencies-smap-radiometer-data-sets) reports a mean near 2.7 days and a required limit of 7 days for L4. Check the actual last date. |
| [POWER meteorology](https://power.larc.nasa.gov/docs/methodology/meteorology/) | Temperature, humidity, wind, and other weather values from MERRA-2 and related processing | Meteorology uses a 0.5 by 0.625 degree grid. [Tutorials](https://power.larc.nasa.gov/docs/tutorials/) give a 1 degree solar grid. The [data FAQ](https://power.larc.nasa.gov/docs/faqs/data/) gives about 2–3 days for weather and 5–7 days for solar data. It is not live field weather. |
| [HLS](https://hls.gsfc.nasa.gov/data-products/) | Surface reflectance and derived vegetation indices from Landsat and Sentinel-2 | 30 m. The current product page gives about 1.4 days between observation opportunities and typically 2–3 days of processing latency. Clouds can leave a much longer gap between valid readings. A small field may contain too few clean pixels. |
| [GLAM](https://glam1.gsfc.nasa.gov/api/doc/about) | Area vegetation time series and comparison tools | Pin the actual sensor, collection, composite period, grid, and crop mask. GLAM is an access and analysis system, not one fixed-resolution sensor. |
| [ECOSTRESS](https://ecostress.jpl.nasa.gov/data/atbds-summary-table) | Surface temperature, modelled evapotranspiration, evaporative stress, and water-use-efficiency products | Product-specific coverage and dates. 70 m products are candidates; test Java scene coverage and quality before use. The ALEXI ET and ESI entries on this page are for CONUS and are not Java choices. |
| [MOD16](https://ladsweb.modaps.eosdis.nasa.gov/filespec/MODIS/61/MOD16A2GF_c61) | Modelled evapotranspiration and related fluxes | 500 m, 8-day composites. Pin regular or gap-filled product and availability. A gap-filled historical series is not an instant monitoring feed. |

No boundary, drawn polygon, centroid request, interpolation, or 3D view makes a coarse source into a farm measurement. Show "your area" for IMERG, SMAP, and POWER.

## All practical metric families

### Rain and water conditions

The following are calculated metrics from IMERG. [NASA's IMERG guide](https://gpm.nasa.gov/data/imerg) supports rain estimates at several time scales and advises care with extreme values.

| Option | Variants | Product use and limit |
| --- | --- | --- |
| Recent rainfall | Last complete day, 7 days, 30 days, season to date | Good first metric. Show complete intervals and units in mm. |
| Rain compared with normal | Difference in mm, percentage difference, percentile | Compare the same calendar period and location. State the historical years. Avoid percentage ratios where normal rain is near zero. |
| Dry spell | Days since meaningful rain, consecutive dry days, longest dry spell this season | Needs daily data and a stated rain threshold. Monthly totals cannot supply it. Missing days do not count as dry days. |
| Rain frequency and intensity | Rainy-day count, largest daily total, largest short-interval rate | Later. Area estimates of extremes need checks. A high value does not prove flooding on the field. |
| Seasonal rain pattern | Monthly profile, wet-season onset signal, season end signal, year-to-year range | Useful for rotation evidence. Onset and end need reviewed local definitions; do not silently invent a planting calendar. |
| Standardised rain deficit | SPI at selected time scales, drought duration | Later. Needs a long, consistent baseline and a tested distribution method. It is a rain deficit measure, not a complete crop diagnosis. |
| Rain minus atmospheric demand | Rain minus ETo, standardised deficit such as SPEI | Later. Pin the evapotranspiration method. Total rain is not effective rain and this is not a complete field water balance. |

### Soil moisture

These use [SMAP L4](https://nsidc.org/data/SPL4SMGP/versions/8), with separate surface and root-zone values.

| Option | Variants | Product use and limit |
| --- | --- | --- |
| Root-zone moisture | Latest valid value, daily mean, recent mean | Main soil metric. Units are cubic metres of water per cubic metre of soil. Do not label it soil health. |
| Moisture compared with normal | Same-season anomaly, percentile, normal range | Prefer a plain dry/normal/wet label with the number in evidence. Use one consistent collection for the baseline. |
| Moisture trend | Change over 7 or 30 days, duration below the normal range | Useful with rain. Smooth short-term noise and disclose the window. |
| Surface moisture | Latest value and trend | Detail view. It can change faster than the root zone. |
| Wetness context | High percentile or sustained wetness | Suggest a field check. It does not measure standing water, oxygen stress, or drainage failure. Paddy flooding needs particular care. |
| Model moisture uncertainty | Quality flags, observation support, uncertainty where the chosen product supports it | Evidence view. A 9 km output grid is not a 9 km independent sensor measurement. |

### Weather and crop development

[POWER](https://power.larc.nasa.gov/docs/methodology/meteorology/) supports these weather families. [FAO-56](https://www.fao.org/4/x0490e/x0490e07.htm) explains the weather inputs for reference evapotranspiration and vapour pressure deficit.

| Option | Variants | Product use and limit |
| --- | --- | --- |
| Recent heat | Daily maximum, 7-day maximum, mean daily maximum | Good first metric. Show the data period; never call an old reading "now". |
| Temperature compared with normal | Mean, maximum, and minimum anomalies or percentiles | Area context. Separate statistical unusualness from a crop harm threshold. |
| Hot days and warm nights | Counts and duration above reviewed thresholds | Needs crop and stage guidance. A broad POWER grid may miss local extremes. |
| Cold exposure | Low minima, cold-day counts | Later where relevant to crop and elevation. |
| Growing degree days | Accumulated thermal time since planting | Later with crop-specific base temperature, upper limits, and local checks. It does not confirm an actual growth stage. |
| Humidity and dew point | Daily humidity, humidity trend, dew point | Detail view or method inputs. They do not alone prove disease conditions. |
| Vapour pressure deficit | Calculated air drying demand | Later. Use compatible temperature and humidity inputs; daily means can hide daytime extremes. |
| Wind | Area mean speed and direction | Detail view. POWER mean wind is not a reliable field gust warning. |
| Solar radiation | Radiation totals and anomaly | Method input or later detail. Check the PRD probe's missing solar values before use. |
| Reference evapotranspiration | ETo per day, week, or season | Calculated demand for a reference surface. Start with the PRD Hargreaves method, with its limits. Consider FAO Penman-Monteith only after complete weather inputs pass checks. |

### Rotation and crop water estimates

These combine NASA inputs with reviewed crop rules and user records. NASA does not publish the finished farm recommendation. [FAO irrigation guidance](https://www.fao.org/4/s2022e/s2022e08.htm) distinguishes crop evapotranspiration, effective rainfall, and paddy water requirements.

| Option | Variants | Product use and limit |
| --- | --- | --- |
| Estimated crop evapotranspiration | Stage-specific Kc times ETo; season total | Main plan metric. It is potential crop demand under stated assumptions, not measured consumption. |
| Rain-to-crop-demand ratio | Historical rain divided by estimated ETc per season | The current PRD screening metric. Name it as a ratio. Raw rain does not equal usable rain. |
| Estimated effective-rain cover | Effective rainfall divided by ETc | Better water accounting, but requires an explicit effective-rain method and checks. Rain timing and storage matter. |
| Estimated rain shortfall | Positive ETc minus effective rainfall | Scenario metric. It cannot give an irrigation order without water supply and field balance. |
| Estimated total paddy water requirement | ETc plus land preparation, ponded-water, seepage, and percolation assumptions | Later or reviewed scenario detail. Rice ETc alone omits these needs. Do not substitute universal numbers for local field knowledge. |
| Demand difference from continuous rice | Difference in estimated ETc in mm or percent over the three seasons | Main comparison. Call it estimated demand reduction, not actual water saved. |
| Area-scaled demand volume | Water depth times mapped area | Later. Polygon error and coarse weather carry into the volume. It remains an estimate. |
| Soil fit | Crop fit for recorded soil; unresolved fit for unknown soil | Main comparison, based on reviewed local guidance. |
| Rotation diversity | Crop sequence, consecutive rice count, legume and fallow seasons | Useful plan detail. It does not prove better soil. |
| Soil benefit notes | Expected effects from crop rules | Qualitative evidence. No arbitrary "soil health score" or measured nitrogen gain. |
| Robustness across seasons | Historical poor-rain years, percentile scenarios, variation in rain cover | Later. Scenarios describe past variability, not a forecast of next season. |
| Planting-window fit | Match to dated KATAM windows | Useful when access is verified. The PRD still records that access as unverified. |

### Vegetation, surface water, and land temperature

[HLS](https://hls.gsfc.nasa.gov/data-products/) includes vegetation-index and OPERA-derived products. [OPERA DSWx](https://www.jpl.nasa.gov/go/opera/products/dswx-product-suite/) describes mapped surface water. [ECOSTRESS product guides](https://ecostress.jpl.nasa.gov/data/atbds-summary-table) describe thermal and evapotranspiration outputs.

| Option | Variants | Product use and limit |
| --- | --- | --- |
| Greenness | NDVI, EVI, seasonal curve, change, anomaly | Later. Cloud and shadow masks, clear-pixel count, and mixed pixels are required. Greenness does not identify crop type, disease, nutrient shortage, or soil health. |
| Cover and bare ground | Vegetation cover estimate, exposed-soil indicator | Later with a tested method. Post-harvest bare ground may be expected. |
| Crop development from imagery | Green-up, peak, decline, possible harvest | Later. Compare against farmer records; do not replace records with inferred facts. |
| Surface-water extent | Water-covered fraction, change in water extent | Later. Confirm product coverage and clean scenes in Java. Intentional paddy flooding is different from damage. Optical data can miss water under plants or clouds. |
| Land surface temperature | Latest clean scene, anomaly, spatial contrast | Later. Surface temperature is different from 2 m air temperature. Overpass time matters. |
| Actual evapotranspiration estimate | ECOSTRESS or MOD16 ET and trend | Later. Satellite products are model estimates and do not measure irrigation applied. Use product quality, dates, and enough pixels. |
| Evaporative stress index | Modelled actual-to-potential ET measure | Later research. Pin a Java-capable product and validate interpretation. |
| Ecosystem water use efficiency | Product GPP-to-ET ratio | Research only for this app. It does not equal harvest per irrigation volume or farmer profit. |

### Farm records and background facts

| Option | Source | Product use and limit |
| --- | --- | --- |
| Crop and elapsed time | Farmer crop and planting date | Main metric. Exact dates give elapsed days. A week or month gives a range. Unknown date gives no stage estimate. |
| Growth and harvest status | Farmer updates, with optional model estimate | Keep recorded facts separate from estimated stage or harvest date. Variety, management, and transplanting can change timing. |
| Crop history and plan progress | Saved plan plus actual crop records | Show planned and planted crops separately. A chosen plan does not prove planting. |
| Farm area | Drawn or selected polygon | Useful farm fact. A point has no measured area. FTW is a predicted outline, not legal ownership. |
| Water source and irrigation records | Farmer report, meter, or local agency | Later. Needed for real water-use reporting and useful for action advice. Unknown stays unknown. |
| Harvest amount and yield | Farmer harvest record and harvested area | Later. NASA alone does not supply verified farm yield. |
| Cost, revenue, and profit | Farmer records and dated local prices | Later. Do not predict them from weather alone. |
| Soil tests | Laboratory or local soil records | Later. Measured pH, carbon, nitrogen, and other soil properties can track change when tests are comparable. |
| Soil property context | Optional [ISRIC SoilGrids](https://docs.isric.org/globaldata/soilgrids/index.html) | Non-NASA, 250 m model predictions with uncertainty and depth. Texture, pH, carbon, nitrogen, and water retention are background estimates. They cannot show short-term soil improvement. |
| Terrain | [NASADEM](https://www.earthdata.nasa.gov/centers/lp-daac) | NASA static elevation at about 30 m. Derive slope for context if needed. Do not infer farm drainage or bund height from this alone. |
| Crop and area maps | BIG, FTW, GFSAD | Background map facts. GFSAD in this PRD is nominal 2015 cropland. It is not a monitoring metric. |
| Data quality | All sources and processing | Show latest observation date, period, version/run, native scale, missing intervals, quality flags, valid pixel coverage, baseline years, and calculation method. This is required for every metric. |

## Forecasts and local additions

For a later district view, [GRACE and GRACE-FO](https://grace.jpl.nasa.gov/) provide monthly regional land-water-storage changes. Groundwater estimates need other data and a model to separate stores. A fine output grid does not mean fine independent measurements. These sources cannot report the irrigation supply of one farm. [GLDAS](https://ldas.gsfc.nasa.gov/gldas/) offers global model water and energy fields on 0.25 or 1 degree grids. Soil moisture, runoff, and water-store trends can add basin context. They do not measure canal flow or available farm irrigation water. Keep both out of the first farmer dashboard.

The PRD sources IMERG, SMAP L4, and POWER describe past and recent conditions. They do not provide the next week's field forecast. Historical season comparisons are not future predictions.

NASA [GEOS products](https://gmao.gsfc.nasa.gov/gmao-products/) include global forecasts. Treat GEOS-FP as a later candidate until Java coverage, forecast skill, issue time, lead time, access, and continuity pass checks. NASA priority does not require NASA to fill every local warning need.

Optional local support includes [BMKG's official weather data](https://data.bmkg.go.id/tentang/), local gauges, irrigation schedules, flood warnings, soil tests, and KATAM. Put forecast issue time and lead time beside forecast numbers. Separate observed, modelled, calculated, forecast, and farmer-reported values.

## Recommended first screen

Use six cards. Keep related numbers inside the same card instead of filling the screen with science variables.

1. Recent rain. Show 7- and 30-day totals, difference from the same-period normal, and dry-spell detail when daily coverage passes checks.
2. Area soil moisture. Show root-zone moisture compared with the same-season normal and a recent trend. Put surface moisture in the detail view.
3. Recent heat. Show the recent area maximum temperature and comparison with normal. Add crop harm thresholds only after guidance review.
4. Estimated crop demand. Show estimated ETc for the recorded crop, method, and planting-date uncertainty. Use a range for rough dates. Suppress stage-specific values when the date is unknown.
5. Rotation comparison. Show season rain-to-demand ratios and estimated demand change from continuous rice. Keep soil fit and crop sequence beside the comparison.
6. Crop progress. Show the recorded crop, planting-date precision, elapsed time or range, and recorded harvest status. Mark growth stage as an estimate if a checked model supports it.

Data dates and limits appear on every card. AI reads these checked metrics and explains them. It does not invent thresholds or convert missing data into confidence.

For the 3D illustration, use the recorded crop and estimated date range for growth. Let dated rain, area moisture, and heat change the scene with plain labels. Do not animate rain as if it is falling on the field now, show cracks as measured field damage, or turn a model growth estimate into observed crop health. Keep an accessible 2D summary available.

Before implementation, extract a Java sample for each source. Record actual available dates, product version, units, scale, quality flags, baseline coverage, and aggregation method. These document checks do not yet prove a working monitoring pipeline.
