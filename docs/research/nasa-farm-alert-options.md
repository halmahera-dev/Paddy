# NASA-first farm alert options

Checked 2 October 2026. This note uses [the main PRD](../prd-government-landowners.md), not the scratch project. It covers the alert families that can help Java farmers. It does not list every satellite collection. The agreed first-version choices are now in the PRD, including saved farms, sign-in, crop records, rough planting dates, in-app alerts, AI explanations, and an illustrated 3D farm. Later options in this note do not expand that scope.

## Data choices and limits

| Source | Coverage, scale, timing | Use and limit |
| --- | --- | --- |
| [IMERG](https://gpm.nasa.gov/resources/documents/imerg-v07-technical-documentation) | Global, including Java; 0.1° grid, half-hour estimates. Early about 4 hours; Late about 14 hours; Final about 3.5 months. Daily sums can be computed. | Use Late for recent rain monitoring; keep Final for historical seasonal plans. These are rain estimates, not forecasts. Compare anomalies with history from the same run/version, or validate a cross-run adjustment. Recheck current V08 transition before extraction. |
| [SMAP L4 V8 SPL4SMGP](https://nsidc.org/data/spl4smgp/versions/8) | Global, including Java; 9 km grid, 3-hourly surface and root-zone model estimates. | Useful area moisture context. L4 is satellite assimilation plus a land model, not a probe in the field. The version uses IMERG rain outside North America/high latitudes, so rain and moisture are not independent evidence. |
| [SMAP latency FAQ](https://nsidc.org/data/user-resources/help-center/what-are-latencies-smap-radiometer-data-sets) | FAQ updated October 2025: L4 required latency 7 days; actual mean 2 days 15 hours 53 minutes. | The older product specification lists 7 days as mean archive latency. Use the latest actual observation timestamp; do not promise an exact delay. Soil-moisture alerts are delayed condition notices. |
| [POWER data sources](https://power.larc.nasa.gov/docs/methodology/data/sources/) and [FAQ](https://power.larc.nasa.gov/docs/faqs/data/) | Global; meteorology 0.5° × 0.625°, solar about 1°; daily met usually 2–3 days late, solar 5–7 days. | Supports recent heat and estimated water demand. Native cells are much larger than farms. Historical data can be revised. POWER recent data are analysis/model estimates, not a weather forecast. |
| [HLS products](https://hls.gsfc.nasa.gov/data-products/) and [access](https://hls.gsfc.nasa.gov/data-access-and-tools/) | Global land including Java; 30 m. Processing usually 2–3 days after observation. | Greenness change at finer scale; clouds and shadows can prevent usable measurements. Revisit does not mean a clear image. HLS-LL is planned for early 2027, not a current six-hour source. |
| [GLAM API](https://glam1.gsfc.nasa.gov/api/doc/gettbl) | VIIRS 500 m and Sentinel-3 OLCI 300 m NDVI series. | Easier area vegetation context. Check Java masks, shapes, period, and quality before choosing it. Not a crop-type, pest, or yield diagnosis. |
| [ECOSTRESS science](https://ecostress.jpl.nasa.gov/science) and [product guide](https://ecostress.jpl.nasa.gov/data/atbds-summary-table) | Observations between ±52° latitude cover Java; gridded thermal products at 70 m; irregular overpasses and clouds. | Later surface-temperature, evapotranspiration, and evaporative-stress context. Choose a global product such as JET; ET_ALEXI is CONUS-only. A daily model product is not a daily clear field observation. Validate local access and timing. |
| [NASA LANCE FLOOD](https://lance.modaps.eosdis.nasa.gov/flood/) | Global daily MODIS/VIIRS flood composites at about 250 m, with 1-, 2-, and 3-day windows. | Later observed water expansion. Cloud shadows can create false detections; inspect imagery. Irrigated rice and recurring water need special treatment. Heavy rain alone does not prove field flooding. |
| [NASA GEOS forecast](https://www.nccs.nasa.gov/geos5-forecast/) and [GMAO product status](https://gmao.gsfc.nasa.gov/gmao-products/) | Global forecast models, including Java, at regional rather than field scale. | Later forecast rain/heat/wind warnings. Select a run and horizon, validate Java forecast skill, and account for the experimental service's lack of guaranteed backup/continuity. |

The PRD's offline seasonal preparation needs a recurring update job before current-condition alerts can work. The app must store the observation time, arrival time, run/version, units, spatial support, quality, valid coverage, and baseline with every signal.

## Full practical alert families

“First” means recommended for the first monitoring release, after source access and rules pass checks. “Later” means useful but needs more data or validation. “Avoid” means do not claim this from the proposed sources.

| Alert family | Signal and units | NASA-first source | Suggested action | Scope |
| --- | --- | --- | --- | --- |
| Low recent rain | 7-/30-day rain total in mm below the seasonal baseline; percentile or departure | IMERG Late daily | Check field water conditions and discuss the next planting decision if it is still ahead | First |
| Persistent dry spell | Consecutive days below a locally reviewed rain-day threshold; days | IMERG Late daily | Inspect the field; compare actual water access with the saved plan | First, combined with low-rain card |
| Heavy recent rain | Daily or rolling rain sum unusually high for this area/season; mm | IMERG Late | Check standing water and existing drainage where safe; record what happened | First |
| Repeated wet days | Several wet days/large multi-day accumulation; days and mm | IMERG Late | Check field access and water conditions before planned work | Later, or part of heavy-rain card |
| Low root-zone moisture | Seasonal percentile or departure of root-zone moisture; m³/m³ underlying value | SMAP L4 | Check whether crops show signs of water stress; report observed conditions | First |
| Fast moisture decline | Change over a reviewed multi-day window; m³/m³ and percentile change | SMAP L4 | Inspect the crop and water conditions | Later; needs a stable time-series rule |
| High soil moisture | Unusually high surface/root-zone moisture | SMAP L4 | Check standing water; do not label this as measured field waterlogging | Later; can support wet-condition notice |
| Combined dry conditions | Low rain and low moisture over their matched dated windows | IMERG + SMAP | Prioritize a field check; review a future planting decision | First; merge duplicate notices, not “two independent confirmations” |
| Combined wet conditions | High rain plus high moisture | IMERG + SMAP | Check standing water and access | Later; do not assert flooding |
| High recent air temperature | Daily maximum/night temperature or multi-day seasonal anomaly; °C | POWER | Check crop condition and discuss exposure during the possible crop stage | Later alert; temperature can be a first metric |
| Unusual cold | Low temperature/cold nights against reviewed crop rule; °C | POWER | Inspect crop condition | Later, low priority for Java; avoid a blanket frost promise |
| High estimated water demand | Reference ETo/estimated ETc above baseline; mm/day or mm/window | POWER + crop coefficients | Compare rain and known water access; inspect the crop | Later; a calculation, not measured crop water use |
| Growing rain-only water gap | Estimated ETc minus rain accumulation; mm | POWER + IMERG + crop/date | Review next-season crop choice; check actual water conditions | Later. This is not irrigation need: runoff, effective rain, soil storage, and water supply are unknown |
| Dry air/high atmospheric demand | Humidity/VPD anomaly; % or kPa | POWER humidity/temperature | Inspect crop condition | Later; derive VPD with an explicit method and temporal caveat |
| Unusual wind | Recent modelled wind; m/s | POWER | Check reported crop damage | Later; not a gust, storm-arrival, or spray-timing warning |
| Low sunlight | Solar-radiation departure over a period; MJ/m²/day | POWER solar | Explain delayed growth as a possible factor, ask for field observations | Later, low priority; cannot diagnose the cause |
| Declining greenness | Quality-screened NDVI/EVI departure from comparable crop stages/seasons; index | HLS or GLAM | Inspect crop and record harvest, weeds, or damage | Later; harvest/fallow can explain decline |
| Uneven vegetation | Within-boundary vegetation difference; index/area | HLS | Check the area highlighted on the map | Later; small farms/mixed pixels and clouds limit use |
| High surface temperature / evaporative stress | Thermal or ET/stress departure | ECOSTRESS | Inspect the crop; do not assert disease or exact irrigation amount | Later research |
| Observed flood/water expansion | Quality-screened water class relative to reference; class/area | LANCE FLOOD, later global OPERA water product if validated | Check local reports and official instructions; avoid entering unsafe areas | Later; rice-water false alerts need checks |
| Nearby active fire | Recent thermal detection within a reviewed distance; location/time | [NASA FIRMS](https://www.earthdata.nasa.gov/s3fs-public/2023-03/FIRMS_OnePager_2022_Prnt-Web.pdf?VersionId=1.pHw_vC487jLkt_aDy.bMvHQxDFC44f) | Consult official local notices | Later, peripheral. Global VIIRS detections about 375 m and usually under 3 hours; not fire spread or smoke concentration |
| Smoke / air-quality context | Modelled surface PM2.5 or ozone; µg/m³ or source-specific units | [GEOS-CF](https://gmao.gsfc.nasa.gov/gmao-products/geos-cf/system-description_geos-cf/) | Consult official local air-quality guidance before field work | Later, peripheral; research analysis plus 5-day forecasts at about 25 km, not a local sensor or crop-damage diagnosis |
| Landslide context for hillside farms | Published model hazard class/probability | [NASA LHASA](https://data.nasa.gov/dataset/global-landslide-nowcast-from-lhasa-l4-1-day-1-km-x-1-km-version-2-0-0-global-landslide-no-0f8e8) | Refer to official local notices | Later, peripheral; area hazard, not measured farm damage |
| Upcoming rain/heat/wind | Forecast threshold and forecast probability, if supported | GEOS forecast; optional local BMKG supplement | Review scheduled work with local guidance | Later, separate forecast card. Never infer future weather from IMERG/SMAP/POWER history |
| Long-term climate change | Scenario ranges for future seasonal rain/temperature | [NEX-GDDP-CMIP6](https://www.nasa.gov/nasa-earth-exchange-nex/gddp/downscaled-climate-projections-nex-gddp-cmip6/) | Compare future rotation scenarios | Later planning evidence, not an urgent alert or prediction for the next planting day |
| Crop-stage check | Crop + planting-date range + reviewed duration | Farmer records, crop table; NASA conditions add context | Confirm growth stage rather than auto-declare it | First record prompt; not a satellite observation |
| Planting-window / season review | Local window or next season approaches | KATAM/default seasons + historical NASA plan evidence | Review the selected rotation and dates | First optional reminder; not a weather hazard |
| Harvest confirmation | Possible maturity window | Farmer crop/date + crop table | Ask if harvest occurred | Later reminder; never mark harvest automatically |
| Data old/missing/low coverage | Latest valid observation time and valid-data fraction | Every source | Show stale/unavailable state and postpone unsupported insights | First system notice |
| Input unresolved | Unknown planting date/soil or unconfirmed crop | Farmer record | Offer an optional update; keep unresolved values visible | First system notice |

## Do not generate these claims from the current data

- Confirmed pests/disease, fertilizer/nutrient deficit, soil pH/texture change, measured soil-carbon improvement, exact irrigation amount, pesticide timing, yield loss, profit loss, farm ownership, or measured savings.
- Field flooding from a rain anomaly, crop drought damage from area moisture alone, or harvest from greenness decline alone.
- Current rainfall or wind in the 3D illustration from delayed daily data. Show a dated illustration of recent conditions, or use a separately labelled forecast/nowcast source.

These need field observations, crop-specific tested models, soil tests, water records, or local sources beyond the PRD. GRACE groundwater changes can add regional context, but cannot diagnose a Java farm's well or irrigation supply.

## Recommended first release

Start with three farmer-facing condition families: **dry conditions** (low rain/dry spell plus optional dated SMAP context), **heavy recent rain**, and **low area root-zone moisture**. When signals overlap, show one card with dated evidence. Add data-status notices and an optional crop/date confirmation prompt. Temperature is useful as a metric first; add heat alerts after crop-specific rules are reviewed.

Each card states what changed, where it applies, when it was measured, the relevant crop-stage range if known, what the farmer can check, and what remains unknown. AI writes the explanation from a fixed evidence object and reviewed action list. It cannot invent thresholds, forecasts, causes, or actions. If the model fails, the fixed card still works.

For a rough planting week/month, compute a range of possible stages. If the stage is unknown or the range crosses an action boundary, give a general field-check action or ask for confirmation. Never silently choose the middle date.

Anomaly rules compare the same local season/day-of-year using a documented reference period with enough valid history. Choose the rain-day threshold, percentile cutoff, persistence period, minimum data coverage, recovery rule, and reminder interval from tests and reviewed guidance. NASA product documentation does not supply universal farm-action thresholds. A published meteorological extreme does not by itself set a crop damage threshold.

Do not repeat the same alert every refresh. Keep first detection, latest condition, acknowledgement, and recovery. Suppress condition claims when evidence is stale, invalid, or incomplete. Show dates in the alert and illustrated farm. In-app alerts are seen when the user opens the app; they are not an emergency warning channel.
