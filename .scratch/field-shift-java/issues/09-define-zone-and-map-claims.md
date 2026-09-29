# Define farming zones and map claims

Type: `grilling`  
Status: resolved  
Parent: [Field Shift Java decision map](../map.md)

## Question

What is the unit called a farming zone in this service, how does it relate to districts, irrigation systems, and predicted FTW fields, and what can the Java-wide map truthfully state at each level? Define the smallest unit for observed crop patterns, risk screening, and rotation comparison, using the documented scale of NASA and local sources. Keep legal parcels separate from predicted field polygons.

## Answer

**A farming zone is a dated, named planning area with a checked boundary and a stable zone ID.** For the first proof, choose one area inside one district with a local partner. Draw its boundary from a partner or other documented local source, and record the source, date, and boundary version. A zone groups plots for area screening and review; it is not an observed field, a legal parcel, or a NASA grid cell. There is no fixed zone size: report how many source cells and usable HLS pixels cover it before showing a result. A small zone can be selected on the map even when the available grid data only describe its wider surroundings.

| Unit | Relationship and valid claim |
| --- | --- |
| Java | Map extent for regional context. Show dated NASA area estimates, source coverage, and FTW predicted outlines where available. Do not call a Java-wide layer verified crop history, field risk, irrigation access, or rotation advice. |
| District (*kabupaten/kota*) | Administrative rollup and the office that may act. Summarize zone results with area, coverage, dates, and missing-zone counts; do not present one grid point as a district measurement. Published BPS and SIMOTANDI totals can be shown at their stated administrative level as separate comparison data. |
| Farming zone | Smallest **area screening** and zone-pattern reporting unit. Show rain, heat, moisture, and crop-cycle indicators as area estimates or inferences, with source-cell coverage and quality. Show locally checked crop-pattern summaries only for the plots and seasons actually covered by records; state that coverage. Do not assign a crop name or a water right to every outline in the zone. |
| Irrigation system or command area | A separate, dated water-service boundary or record that can overlap several zones or districts. Link its documented service area to zones and checked plots; split or report overlaps rather than assuming one district or zone equals one system. A map overlap alone does not prove delivery or seasonal water availability. Keep rainfed and irrigated evidence separate when comparing plans. |
| FTW predicted field | A map and sampling candidate, with its prediction year and confidence. It is not a stable plot ID, a checked boundary, or a legal parcel. Several predictions may match one local plot, or none may match. |
| Checked local plot | Smallest unit for a **named observed crop sequence** and a **plot rotation comparison**. Use a local plot ID, checked geometry, dated crop records, and the needed local water facts. The plot is an operational crop unit; make no ownership or cadastral claim unless separate legal records support it. Link FTW predictions only after local geometry review. |

**What each job can say:**

1. **Past crop patterns:** At zone or district level, report recorded crop counts or shares only with the number and area of checked plots, seasons, and missing records. HLS can add a crop-cycle timing inference where clear, unmixed observations exist. An HLS signal or SIMOTANDI rice-phase total does not establish a named crop sequence for a plot. Mark uncertain names and dates **unknown**.
2. **Risk screening:** Compare zones to choose where staff should check conditions locally. Keep the source grid and zone coverage visible. NASA IMERG rain is about 0.1° (roughly 10 km), SMAP moisture is 9 km, and standard POWER weather and solar inputs are coarser. Splitting one source cell into many zones does not create independent zone observations. If a zone has too little valid coverage, show the source-cell context and mark its zone result unavailable; do not rank it from a single unsupported value.
3. **Rotation comparison:** Run the checked calendar and water screen for a local plot when its boundary and required inputs are checked. Missing history or soil class blocks only results that use them. Before the partner data gate passes, a zone may show a clearly labeled comparison of example plans under stated assumptions. It is a scenario for local review, not advice for each FTW outline or a validated recommendation to farmers.

**Map rule:** Each visible value states its unit, source, version, time period, spatial scale, coverage, and status: observation, inference, scenario, or locally reviewed result. A fine FTW outline under a coarse NASA color does not increase the NASA value's precision. Keep legal parcels and tenure out of the FTW layer. The first proof has one checked zone only after the [partner data gate](./10-choose-pilot-evidence.md); until then, call its zone view exploratory.

The scale limits come from [NASA IMERG](https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGDF_07/summary?keywords=imerg), [NASA POWER source methods](https://power.larc.nasa.gov/docs/methodology/data/sources/), [NASA HLS](https://forum.earthdata.nasa.gov/viewtopic.php?t=6889), and [NASA SMAP](https://nsidc.org/data/spl4smgp/versions/8). [FTW's data notes](https://source.coop/ftw/global-data) define its polygons as remote-sensing units, not legal parcels. [SIMOTANDI's public table](https://simotandi.pertanian.go.id/data-tabular) reports rice phase areas down to *kecamatan* and groups fallow with non-rice crops.
