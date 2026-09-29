# Define the working proof and checks

Type: `prototype`  
Status: resolved  
Parent: [Field Shift Java decision map](../map.md)
Blocked by: 05, 10

## Question

What small runnable proof can show the chosen data and calculation end to end for one Java zone? Specify the user action, real data shown, two rotation inputs and outputs, source and uncertainty display, and checks against local records or KATAM. Set pass/fail tests that reveal whether the technical approach is credible before scaling it.

## Draft for review

**One user path:** select any *kecamatan* on the Java map → inspect its area screening evidence → for the later data-complete *kecamatan*, inspect crop-cycle evidence, enter two proposed rice, maize, or soybean sequences, compare calendar fit and water demand, and open a short evidence note. Each result keeps its area ID and published data revision. The user can see which result is observed, inferred, estimated, or unavailable. The interface does not use **exploratory** as a label. Before the partner data gate passes, the evidence note states the limits in plain language: it uses area data and example plans, and it is not plot-specific advice.

**Data in the proof:** Java-wide *kecamatan* boundaries, visible FTW PMTiles, and Java-wide area screening from stated NASA sources and coverage rules. The later data-complete *kecamatan* adds a checked boundary and local plot links after the [partner data gate](./10-choose-pilot-evidence.md) passes; daily POWER values fetched live through the backend and cached by source cell; dated IMERG, HLS, and SMAP samples; and dated local crop, irrigation, and soil records supplied by the partner. Show the actual product version, date range, geographic scale, unit, coverage, and import revision beside derived results. Do not present a sample as a current feed.

**Comparison:** the user enters two crop sequences and planting windows. The app shows each plan's calendar fit, crop water demand, rain exposure, and, only with the needed local soil and irrigation facts, a soil-based water gap and irrigation feasibility. Show the rule or calculation version, input period, missing inputs, and reasons for each result. Show relevant KATAM guidance as a baseline with its date and area; do not say that the pilot outperforms KATAM without an independent check.

### Pass or fail checks

| Check | Pass condition |
| --- | --- |
| Data path | A fresh selected *kecamatan* renders FTW tiles and Java-wide screening from a published revision. The later data-complete *kecamatan* also obtains one real POWER daily series or a clearly dated valid cache entry. No full-country science file reaches the browser. |
| Repeatability | Re-running the import from the same manifest produces the same prepared values and source links. A failed import leaves the prior published revision usable. |
| Identity and scale | Every view keeps the zone ID; crop events attach to checked local plot IDs only. FTW outlines stay labeled as predictions. NASA grid values stay labeled as area estimates. |
| Calculation | Two known test plans produce independently checked calendar and water results from the recorded inputs. Changing a planting window or crop changes only the results it should change. |
| Missing data | Removing crop history, soil class, irrigation facts, or a weather period removes only dependent claims and shows a reason. The app never fills an unknown crop name from an HLS curve. |
| Evidence | An evidence note contains the two input plans, output values, source products and versions, dates, units, quality flags, published revision, and KATAM baseline. A reviewer can trace each output to its inputs. |
| Partner data gate | The chosen zone has permitted, checked local plot and crop records plus an independent check set under [ticket 10](./10-choose-pilot-evidence.md). The pilot may claim validated crop or water performance only after the separate evidence standard sets a held-out sample and success limit. |

**Before the gate passes:** every *kecamatan* can show Java-wide area screening, with source scale and coverage. A *kecamatan* with no local records shows: **No local records are connected to this area yet.** Its crop history and rotation comparison remain unavailable. The runnable path can test data access and calculation with example plans in a stated area, but it cannot claim checked plot-level crop history or a validated rotation recommendation. The first working-proof milestone stays open until the partner data gate passes.

## Answer

The first working proof is a Java-wide map-screening service. Users can select any *kecamatan* and inspect dated area screening with its source, scale, coverage, and status. A *kecamatan* without connected local records shows the reason plainly; it does not show invented crop history or rotation advice.

The service has two stages. Stage one proves Java-wide screening, the data path, repeatable imports, source tracing, missing-data handling, and checked example calculations. The UI does not use **exploratory** as a label. Its evidence note explains when information is area-level, based on example plans, or not plot-specific advice. Stage two starts when one *kecamatan* has permitted, checked local records and an independent check set. Only then can crop-history and rotation claims be checked and later validated.

The proof uses one shared path: select area, inspect screening evidence, then—only in the data-complete area—inspect crop evidence, compare two plans, and open the evidence note. Java-wide screening does not imply Java-wide local facts. The former one-zone technical architecture is reopened because this decision needs a Java-wide preparation, storage, query, and refresh design.
