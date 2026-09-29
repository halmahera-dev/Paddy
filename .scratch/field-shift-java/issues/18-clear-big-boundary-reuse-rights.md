# Clear reuse rights for BIG kecamatan boundaries

Type: `task`  
Status: resolved  
Assignee: heritsam  
Parent: [Field Shift Java decision map](../map.md)
Blocked by: 14

## Question

Find published BIG terms or obtain a written answer that covers copying the June 2026 kecamatan geometry, transforming it into vector tiles, serving those tiles publicly, and required attribution. Record the exact terms and source. If those uses are not allowed or remain unclear, identify a licensed boundary source with usable Java coverage and IDs before the release plan relies on self-hosted tiles. This task clears a publication dependency; it does not publish tiles.

## Answer

**BIG's June 2026 layer is still not cleared for self-hosted public tiles.** The [dataset page](https://data.go.id/dataset/dataset/batas_kecamatan_ar_2026) calls it “Terbuka” and “Downloadable Data,” but gives no specific reuse license. The [BIG MapServer metadata](https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KECAMATAN_AR/MapServer?f=pjson) names BIG in `copyrightText` and sets `exportTilesAllowed` to `false`. That server flag concerns its tile export API; it does not by itself decide the copyright terms for derived tiles. I found no published permission that covers copying the June 2026 geometry, converting it to vector tiles, and serving those tiles publicly. No written answer from BIG was obtained. Do not publish our own tiles from that layer until BIG confirms those uses and attribution in writing or publishes clear terms.

**A licensed fallback exists:** [OCHA/HDX's Indonesia Subnational Administrative Boundaries](https://data.humdata.org/dataset/cod-ab-idn), via its [dataset metadata API](https://data.humdata.org/api/3/action/package_show?id=cod-ab-idn), includes ADM3 (*kecamatan*) geometry in its GeoJSON archive. HDX lists the license as [CC BY 3.0 IGO](https://creativecommons.org/licenses/by/3.0/igo/deed.en). That license permits copying, transforming, and redistributing the data, including as public vector tiles. Credit OCHA ROAP as contributor and OCHA FIS/HDX as publisher, link the dataset and license, state that the shapes were simplified and tiled, preserve supplied notices, and do not imply their endorsement. The [license text](https://creativecommons.org/licenses/by/3.0/igo/legalcode.en) requires credit and identification of adaptations.

The HDX record says the boundaries were created in April 2020 and reviewed in October 2025. It lists 7,069 ADM3 records nationally. Its ADM3 spreadsheet has **2,153 Java-province records** across Jakarta, West Java, Central Java, Yogyakarta, East Java, and Banten, with nonblank, unique `adm3_pcode` values in each province. The GeoJSON archive contains `idn_admin3.geojson`. These are usable **release-scoped HDX IDs**, not the 2026 `KDCPUM` codes from BIG. The counts differ from the 2,146 coded features and 11 unallocated polygons seen in the BIG sample; do not join the two releases by name or treat their shapes as equivalent. The [HDX resource and license metadata](https://data.humdata.org/api/3/action/package_show?id=cod-ab-idn) supports this source check; full geometry and code matching are still to be tested.

For the release plan, use the HDX source as the licensed public-tile fallback if BIG terms stay unclear. Keep its 2020 date and `adm3_pcode` in the tile and summary key. Before selecting it for a public Java-wide release, inspect the full Java geometry, check missing or changed *kecamatan*, and build a reviewed crosswalk to the applicable current administrative codes. Any unmatched area stays unavailable. A later BIG license can allow a new boundary release with recomputed summaries; it cannot retroactively turn HDX IDs into `KDCPUM`.
