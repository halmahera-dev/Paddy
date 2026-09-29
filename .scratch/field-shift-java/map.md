# Field Shift Java: decision map

Label: `wayfinder:map`  
Status: cleared — hand off to `/to-spec`

## Destination

A decision-ready product and technical plan for a long-term service for Indonesian government teams, district agriculture offices, researchers, and farmers. The service will cover Java and support area screening, crop history, crop rotation comparison, and a later farmer chat entry point. Its first milestone is Java-wide *kecamatan* map screening using real NASA data and FTW field predictions. Later, one data-complete *kecamatan* adds checked local records for crop history and rotation comparison. Farmer chat follows a checked pilot and an advice release gate. The plan must show data flow, calculation, validation, a NASA Space Apps demo path, and steps to a maintained service.

## Notes

- The user chose a long-term service, four user groups, three map functions, and a later farmer chat entry point. Results first apply to a district or farming zone. A Java map gives wider context; a pilot chosen by local data access tests advice.
- No Java pilot partner is confirmed. The [partner data gate](./issues/10-choose-pilot-evidence.md) must pass before the first milestone can claim checked plot history or tested rotation advice. NASA and FTW data-path work can continue as an exploratory zone-level demonstration.
- The [data → services → backend → frontend flow](./issues/07-map-service-flows.md) is settled. Processing services are logical jobs or modules. Java-wide screening uses prepared boundary tiles and versioned *kecamatan* summaries; later deployment and refresh rules remain open. The earlier [flow draft](./service-flows-draft.md) describes the former pilot-first scope.
- The existing repo has Next.js 16, React 19, MapLibre, and a PostgreSQL connection through Neon. Its map screen has no agriculture data pipeline yet.
- BIG's June 2026 kecamatan geometry remains a technical candidate, but its public tile reuse rights are unclear. OCHA/HDX's CC BY 3.0 IGO ADM3 layer can support dated 2020 screening after release checks. Its reviewed crosswalk has 2,125 candidate current-code matches and 21 current codes held as unavailable; the name differences and held areas still need local review before publication.
- Use the [Indonesia agriculture and data research](../../docs/research/indonesia-agriculture-and-data.md) as starting evidence. NASA observations have priority for climate and vegetation; FTW supplies predicted boundaries; local records supply named crops, irrigation, and measured soil facts.
- For Java-wide screening, prepare IMERG, POWER, SMAP, and HLS summaries in an operator-started batch. Each source uses its most recent available period and shows that period separately. In the later local pilot, fetch detailed POWER series live with a source-cell cache. Keep source, version, date, unit, scale, and quality with derived values.
- Compare the service with Kementan's KATAM planting calendar. Keep predicted field geometry separate from legal parcels, and label observations, inferences, scenarios, and recommendations distinctly.
- This map resolves decisions. Implementation follows a product and technical spec.

## Decisions so far

- [Choose a rotation comparison engine](./issues/01-rotation-engine.md): Begin with clear calendar and water checks; test AquaCrop scenarios only after local validation.
- [Verify the NASA and FTW data path](./issues/02-nasa-ftw-data-path.md): Use FTW tiles for the browser map and prepared zone data for analysis; track NASA access and product versions.
- [Test a path to crop history evidence](./issues/03-crop-history-method.md): Use dated local records for crop names, with NASA HLS and radar as checked crop-timing evidence.
- [Map the flow for each service](./issues/07-map-service-flows.md): Use data → logical processing services → backend → frontend, plus a direct FTW tile path and live cached POWER in the first proof.
- [Define the pilot input contract](./issues/04-pilot-input-contract.md): Anchor plots to checked local geometry; compare proposed plans despite missing history or soil class, and withhold only unsupported results.
- [Choose the pilot evidence and partner](./issues/10-choose-pilot-evidence.md): Select a zone only after a partner supplies permitted, checked plot and crop records, water facts for dependent results, and an independent check set. Until then, label the runnable path exploratory.
- [Prioritize the user decisions](./issues/08-prioritize-user-decisions.md): Give Maps three equal modes that share a zone. Screening selects areas for local checks; uncertain crop names stay unknown; comparison ends with an agronomist review note. Researchers inspect and export source evidence.
- [Define farming zones and map claims](./issues/09-define-zone-and-map-claims.md): A dated farming zone is the smallest area screening unit; checked local plots anchor named crop history and plot comparisons. Districts are administrative rollups, irrigation service areas can cross them, and FTW outlines remain predictions. Java-wide layers give dated regional context, not field-level facts.
- [Define the working proof and checks](./issues/06-working-proof.md): Start with Java-wide *kecamatan* screening and visible data limits; add checked crop history and rotation comparison only after one *kecamatan* passes the partner data gate.
- [Define the smallest technical architecture](./issues/05-technical-architecture.md): Publish operator-prepared Java-wide boundary tiles and per-source *kecamatan* summaries in Neon; keep checked zone and plot evidence in a later pilot path.
- [Design the three-job workflow](./issues/11-design-three-job-workflow.md): Keep one selected area across three equal map modes; show source evidence in each and end with local-check, review-note, or export actions.
- [Set the rotation evidence standard](./issues/12-set-rotation-evidence-standard.md): Use checked plot comparisons as unvalidated agronomist review aids; test calendar and water results by land type, show dated KATAM guidance, and withhold unsupported preferences.
- [Verify Java kecamatan boundaries and IDs](./issues/14-verify-kecamatan-boundaries.md): Use BIG's June 2026 layer and `KDCPUM` as a candidate for dated screening; validate the full snapshot and clear tile reuse rights before publication.
- [Measure the Java-wide NASA import path](./issues/15-measure-java-import.md): Sample reads work for IMERG, POWER, SMAP, and HLS across three kecamatan; cloud gaps, coarse cells, and unmeasured full-service costs remain release limits.
- [Decide the role of a chat assistant](./issues/17-decide-chat-role.md): Add farmer chat after the checked pilot; base reviewed crop, timing, and water advice on checked plots and approved local rules.
- [Set source freshness and mixed-date rules](./issues/16-set-source-freshness-rules.md): Show IMERG Early/Late and POWER's latest days as current but provisional; require a 10-day, 30%-floor HLS composite; split SMAP unavailability into outage vs. coarse-grid-miss; never blend sources with different periods into one derived value.
- [Clear reuse rights for BIG kecamatan boundaries](./issues/18-clear-big-boundary-reuse-rights.md): BIG public tile reuse is still unclear; OCHA/HDX ADM3 is a licensed fallback with older geometry and distinct IDs.
- [Set the farmer plan release gate](./issues/19-set-farmer-plan-release-gate.md): Hold all farmer advice until every included pilot group and output passes pre-set independent limits, the partner signs off, and an agronomist approves each plan.
- [Set farmer and plot-data access rules](./issues/20-set-farmer-plot-access-rules.md): Farmers request links; partner staff check and manage them, with separate farmer plans and limited access to records.
- [Verify the licensed Java boundary fallback](./issues/21-verify-licensed-boundary-fallback.md): HDX supports dated 2020 screening after release checks; 2,125 crosswalk candidates can be reviewed, while 21 current codes stay unavailable until boundary issues are resolved.
- [Plan the path from demo to service](./issues/13-plan-phased-service.md): Demo the public HDX-based Java screening map at Space Apps (14–15 Nov 2026), with an HLS sample fallback after 11 Nov; then run a partner/pilot track and a service-upkeep track in parallel, with monthly manual refresh and three levels of decision measures.

## Not yet specified

- Which *kecamatan* and local partner can supply records that pass the data gate.
- Whether crop detection can meet a useful accuracy level beyond the pilot.
- How to show uncertainty and disagreement between NASA data and local records beyond the source freshness rule.
- Which local crop and soil rules an agronomist will approve for comparison.
- How to set an automatic refresh schedule and measured operating cost after the first operator-run release (monthly manual refresh and a ~$20/month ceiling are set for now).
- Which Space Apps challenge the demo fits, and the rules on work done before the event (recheck on 28 Oct 2026).

## Out of scope

- National rollout outside Java during this planning effort.
- Legal parcel or land ownership claims from FTW polygons.
- Training a new field boundary model before testing the published FTW layer.
- Claiming field-level soil chemistry, irrigation access, or crop species from coarse NASA grids alone.
- Farmer-facing fertilizer and pest treatment in the first chat plan.
