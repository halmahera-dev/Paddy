# Licensed Java boundary fallback check

Checked 28 September 2026. This check supports [Verify the licensed Java boundary fallback](./issues/21-verify-licensed-boundary-fallback.md). The row-level review is in [hdx-big-crosswalk-review.csv](./hdx-big-crosswalk-review.csv).

## Sources and method

- [OCHA/HDX Indonesia COD-AB metadata](https://data.humdata.org/api/3/action/package_show?id=cod-ab-idn) identifies version `v01`, `valid_on` 1 April 2020, a 30 October 2025 review, and license `cc-by-igo`. I read the full `idn_admin3.geojson` from its [GeoJSON archive](https://data.humdata.org/dataset/cod-ab-idn). The archive SHA-256 was `d285a40f9fc4b726b1bda98ee833d52d23d94fe78b6a47c0a769d2e912ff097`; the extracted ADM3 file SHA-256 was `803ade4feaab704116ff9aaf6fc003a45e8d72293283ed13a50eccd8513ddf75`.
- I extracted all six Java province codes (`31`–`36`) from the [2025 Ministry of Home Affairs decision appendix](https://peraturan.bpk.go.id/Download/384753/Lampiran-Kepmen%20300.2.2-2138%20Tahun%202025.pdf). I compared that set with the coded features returned by [BIG's June 2026 kecamatan service](https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KECAMATAN_AR/MapServer/0). The sets match exactly: 2,146 codes. BIG's [dataset record](https://data.go.id/dataset/dataset/batas_kecamatan_ar_2026) says its June 2026 release follows the 2025 code decision and its amendment.
- For the crosswalk test, I compared each full HDX polygon with BIG geometry queried at a `0.001` degree generalization. I matched province, district name, area name, and spatial overlap. The CSV records the best BIG candidate, the intersection divided by the smaller polygon area, and intersection over union (IoU). The geometry scores are approximate review measures because BIG was generalized and the comparison used longitude and latitude coordinates. They do not replace a survey or a legal boundary check. The BIG query result was not saved or licensed for publication.

## Full Java check

| Province | HDX ADM3 features | Current official codes | Crosswalk candidates with same name | Candidates with different name | Current codes held |
| --- | ---: | ---: | ---: | ---: | ---: |
| Jakarta | 46 | 44 | 42 | 0 | 2 |
| West Java | 630 | 627 | 614 | 9 | 4 |
| Central Java | 577 | 576 | 564 | 3 | 9 |
| Yogyakarta | 78 | 78 | 78 | 0 | 0 |
| East Java | 667 | 666 | 656 | 6 | 4 |
| Banten | 155 | 155 | 152 | 1 | 2 |
| **Total** | **2,153** | **2,146** | **2,106** | **19** | **21** |

All 2,153 HDX Java features have nonblank, unique `adm3_pcode` values and nonempty geometry. Their shapes are 2,029 Polygons and 124 MultiPolygons. One polygon, Padureso (`ID3305091`), has a ring self-intersection. A `make_valid` check changed its geometry type but not its measured planar area; it still needs an explicit repair and visual check before use. The other 2,152 shapes passed the geometry-validity check.

Ten HDX features are lakes, reservoirs, forest, or water areas, rather than current kecamatan. The CSV marks them `exclude_non_kecamatan`. Their inclusion explains most of the count difference; do not give them an administrative summary or force them onto the nearest code.

The 2,106 `candidate_same_name` rows have the same normalized district and area names, a unique current-code target, at least 70% overlap of the smaller shape, and at least 0.70 IoU. Another 19 rows meet the spatial and district checks but their names differ. These are listed as `candidate_name_difference`. The differences include likely spelling changes, short names, and Ijen/Sempol in Bondowoso. Their current names and codes need a named reviewer before a release. No match relies on name alone.

The remaining 21 current codes are held. They are `31.01.01`, `31.01.02`, `32.02.38`, `32.10.25`, `32.13.26`, `32.14.15`, `33.03.18`, `33.05.24`, `33.09.02`, `33.09.04`, `33.09.17`, `33.09.18`, `33.09.20`, `33.09.21`, `33.09.22`, `35.09.22`, `35.12.13`, `35.25.14`, `35.25.16`, `36.01.01`, and `36.01.02`. These include the invalid Padureso shape, island and coastal changes, and areas with substantial boundary changes. Their rows must show unavailable if the product names the current kecamatan. Do not fill them from a nearest HDX polygon.

Boyolali has a clear split case. The 2020 Ampel outline covers about 30% of the current Ampel and 63% of Gladagsari when measured against the old area. The 2020 Musuk outline covers about 41% of current Musuk and 53% of Tamansari. The 2020 Wonosegoro outline covers about 38% of current Wonosegoro and 60% of Wonosamodro. A single 2020 summary cannot represent either member of each pair. Kemusu also has a substantial shape change. The row-level CSV flags these cases for review.

## Release decision

The licensed HDX layer can support a **dated 2020 Java screening map with explicit gaps**. Key tiles and summaries by `(HDX release, adm3_pcode)`. Publish an area summary only after its full HDX shape is valid, its 2020 area is still suitable for the stated analysis, the source import passes, and the crosswalk row has been reviewed for the claim shown. The 2,106 same-name rows are the first review set. The 19 name-difference rows need a recorded name/code decision. Hold the 21 current codes above as unavailable for current-code screening until their boundary and any split or change are resolved. The map must state **“2020 HDX boundary; 2025 code list checked against BIG June 2026”** and show unavailable areas, not call the shapes current boundaries.

The review above is a technical candidate, not a partner-approved crosswalk or a completed Java-wide NASA import. The 70% and 0.70 thresholds are conservative triage values, not official boundary tolerances. Before public release, freeze the source archive and code list, check the 19 name differences and 21 held areas with a local boundary reviewer, repair or exclude Padureso, and run a visual spot check of the 2,106 same-name rows and their tiles. A later licensed BIG release needs its own summaries and keys.

The [CC BY 3.0 IGO license](https://creativecommons.org/licenses/by/3.0/igo/deed.en) permits adaptation and public tiles with attribution. Credit **OCHA ROAP** as contributor and **OCHA FIS/HDX** as publisher; link the [dataset](https://data.humdata.org/dataset/cod-ab-idn) and [license](https://creativecommons.org/licenses/by/3.0/igo/deed.en); say the geometry was simplified and tiled; preserve source notices; and do not imply OCHA endorsement. BIG geometry must not be put into public tiles while its reuse terms remain unclear, as recorded in [Clear reuse rights for BIG kecamatan boundaries](./issues/18-clear-big-boundary-reuse-rights.md).
