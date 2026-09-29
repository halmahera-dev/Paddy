# Define the pilot input contract

Type: `grilling`  
Status: resolved  
Parent: [Field Shift Java decision map](../map.md)
Blocked by: 01, 03, 07

## Question

What minimum checked inputs must one pilot zone provide to run and test the chosen rotation comparison: field or zone geometry, past crops and dates, soil properties, irrigation, crop varieties, and observed outcomes? Which values may be estimated from NASA or other grids, which must come from local records, and how will missing values be shown?

## Answer

Contract for the first **calendar and water screen**:

| Input | Minimum checked record | Source and use if missing |
| --- | --- | --- |
| Location | A named pilot zone with a dated boundary; plot IDs and boundaries checked against local records for any plot-level crop claim. Link FTW predictions only after a geometry check. | A predicted FTW polygon cannot establish a legal parcel or attach a crop history by itself. If the plot link fails, show zone context only. |
| Past crops | When available, dated, plot-linked crop names and planting and harvest dates. Record fallow as its own event and mark recalled dates as ranges. | HLS and radar can support cycle timing; they cannot silently fill a missing crop name. With no checked history, compare proposed plans using current inputs and leave past rotation effects unknown. |
| Candidate crops | Two explicit sequences with proposed planting windows and locally checked crop durations. Record the local cultivar when known; use a named, agronomist-approved duration range when it is not. | No agreed duration means calendar feasibility stays unknown. Do not call a generic cultivar a local observation. |
| Land and water | Locally checked rainfed or irrigated type, irrigation access and seasonal limits, plus a basic soil texture or water-holding class and paddy drainage or bund status where relevant. | NASA SMAP and soil grids provide area context only. If local soil class is unknown, show crop water demand and rain exposure, but withhold the soil-based water gap and irrigation estimate. Missing irrigation facts block irrigation feasibility. |
| Weather | Dated daily rain and weather series with coverage, unit, version, grid scale, and local time basis. Compare against available BMKG or local rain observations. | POWER and IMERG may supply estimates for the source cell. Missing dates or failed checks lower quality or block the numeric water result. |
| Observed outcomes | Hold aside dated actual planting, harvest, irrigation, yield, and any measured soil or canopy values available on independent plots or seasons. Keep measurement method and unit. | These test the screen and later AquaCrop scenarios. A missing outcome does not become a predicted observation; it limits validation claims. |

Show each input as **checked local record**, **grid estimate**, **inference**, or **unknown**, with its date, geographic scale, and source. Show a missing-input list next to each result. The calendar screen may still show supported facts when one part is unknown. Publish numeric crop water demand only when its weather, crop-duration, and calculation assumptions are explicit. Soil tests and measured yields are not prerequisites for the first calendar screen; they are needed to validate later soil or yield claims.

The user confirmed this contract. A checked local plot ID and boundary anchor the comparison; FTW is a predicted outline that must be linked after review. Missing soil class or crop history does not block a prospective plan comparison. No checked history means past rotation effects stay unknown. No local soil class means the screen can show crop water demand and rain exposure, but it withholds the soil-based water gap and irrigation estimate. Each missing input blocks only the result that needs it. Measured yields and soil tests are reserved for validation and later model claims.
