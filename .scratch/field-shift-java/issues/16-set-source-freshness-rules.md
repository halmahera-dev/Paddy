# Set source freshness and mixed-date rules

Type: `grilling`  
Status: resolved  
Assignee: heritsam  
Parent: [Field Shift Java decision map](../map.md)
Blocked by: 15

## Question

With the most recent available observation period chosen separately for IMERG, POWER, SMAP, and HLS, when is each indicator too old or too sparse to show as a current screening value? Decide how the view shows different periods, how unavailable values affect comparison between *kecamatan*, and whether any cross-source statement is valid when periods differ. Use measured coverage and source latency from the Java import test.

## Answer

**IMERG**: Show Early/Late (near-real-time) as the current rain value, labeled explicitly as provisional. Show Final separately as a longer-history reference; Final's frozen 30 September 2025 end date makes it unusable as a "current" value. Never merge Early/Late into a Final-based trend line as one uniform series.

**POWER**: Show the latest available days as current, flagged "preliminary" since NASA mixes near-real-time GEOS-IT with later MERRA-2 revisions. Do not hold back recent days waiting for the stable MERRA-2 pass; let the next scheduled batch overwrite a preliminary value when a revision arrives.

**HLS**: A single scene is not enough — measured clear-pixel coverage ranged from 7.7% to 99.6% for one scene in the import test. Composite scenes over a 10-day window (covering several revisits of the 2–3 day nominal cadence) and require 30% clear-pixel coverage on the composite before showing a vegetation value. Below that floor, show "no usable HLS scene" rather than a number.

**SMAP**: Distinguish two unavailable states rather than collapsing them into one label: "no SMAP data for this period" for an outage or reprocessing window (e.g. the 14 May–28 July 2026 geolocation issue), and "no SMAP cell for this zone" for a coarse 9 km grid with no cell center inside a small kecamatan. The first may resolve on the next batch; the second will not, since it is a geometry limit, not a freshness one.

**Mixed periods on one card**: Each source keeps and shows its own date/period next to its value; there is no unified "as of" date across sources. This matches the map rule already set in [Define farming zones and map claims](./09-define-zone-and-map-claims.md): every visible value states its own source, version, time period, and status.

**Effect on comparison between kecamatan**: Unchanged from the existing rule in that same ticket — a zone with too little valid coverage shows its source-cell context and is marked unavailable, not ranked from a single unsupported value.

**Cross-source statements**: Never combine values from different sources with different periods into one derived number (e.g. a blended "risk level" from rain + moisture + vegetation). Show each source's value and date separately and let the viewer read them side by side. A blended indicator, if wanted later, needs its own ticket and its own evidence standard rather than riding on this freshness decision.

**Left open**: The batch-age cutoff for a whole-card "stale batch" warning (independent of per-source period labels) belongs to the later automatic refresh-schedule decision, not this ticket — it stays in the map's Not yet specified list.

The user confirmed all seven questions in the live discussion.
