# Verify the licensed Java boundary fallback

Type: `task`  
Status: resolved  
Assignee: heritsam  
Parent: [Field Shift Java decision map](../map.md)  
Blocked by: 18

## Question

Can OCHA/HDX's CC BY 3.0 IGO Indonesia ADM3 release support the first public Java-wide *kecamatan* screening if BIG's tile reuse terms remain unclear? Inspect the full Java GeoJSON geometry and unique `adm3_pcode` values, compare its 2020 coverage with the applicable current *kecamatan* code list and BIG's June 2026 candidate, and record unmatched, renamed, split, and changed areas. Test a reviewed crosswalk without assuming name matches are safe. State which areas can get a published summary, which must remain unavailable, and whether the older boundary is acceptable for dated screening. Preserve the license, source, and attribution requirements from [Clear reuse rights for BIG kecamatan boundaries](./18-clear-big-boundary-reuse-rights.md).

## Answer

**Use the licensed HDX layer for a dated 2020 Java screening map with visible gaps, after the release checks.** Key its tiles and summaries by the HDX release and `adm3_pcode`. Do not label its outlines as current or replace a failed match with the nearest current code.

The full ADM3 GeoJSON has 2,153 Java features with unique, nonblank IDs. Ten are special water or forest areas rather than current *kecamatan*. One more, Padureso, has invalid geometry. The 2025 official code appendix and BIG's June 2026 layer have the same 2,146 Java codes. A geometry and name review produced **2,106 same-name crosswalk candidates** and **19 different-name candidates**. The remaining **21 current codes must be unavailable** for current-code screening until their boundary changes, splits, or geometry defects are resolved. The different-name pairs also need a recorded reviewer decision before publication. The old Ampel, Musuk, and Wonosegoro shapes each span a current pair in Boyolali; no single old summary can be assigned to either member of those pairs.

The full method, sources, exceptions, and release rule are in the [boundary fallback check](../licensed-boundary-fallback-check.md), with every row in the [crosswalk review CSV](../hdx-big-crosswalk-review.csv). The crosswalk is a technical candidate; it is not a partner-approved current boundary release or a completed Java-wide NASA import. Preserve HDX's CC BY 3.0 IGO attribution and adaptation notice. BIG geometry remains barred from our public tiles until its reuse rights are clear.
