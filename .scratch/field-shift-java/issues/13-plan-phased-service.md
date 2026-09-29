# Plan the path from demo to service

Type: `grilling`  
Status: resolved  
Parent: [Field Shift Java decision map](../map.md)
Blocked by: 06, 11, 12, 15, 16, 17, 18, 19, 20, 21

## Question

What is the smallest honest NASA Space Apps demo, and which later steps turn it into a maintained Java service? Set the order for pilot validation, Java-wide coverage, data refresh, agency workflow, the later farmer chat release, and measures of useful decisions. Name the work that remains outside the first release.

## Answer

**The Space Apps demo (14–15 November 2026) is the stage-one Java screening map, run and published by hand.** It is a public map on HDX 2020 ADM3 boundaries, with the CC BY 3.0 IGO attribution and a visible date label. It covers the ~2,125 crosswalk candidates; the 21 held current codes show as unavailable. One validated revision supplies IMERG, POWER, SMAP, and HLS. An indicator that fails its coverage rule shows "unavailable" with the reason. If the full HLS run has no valid published revision by **11 November 2026**, HLS runs on a stated sample and shows as unavailable in all other areas. The demo has no stage-two UI. Areas show **No local records are connected to this area yet.** Example-plan calculation checks stay as tests.

**Demo gate on 28 October 2026**, when the full challenge statements are released: frame the demo for the closest challenge without changing this scope, and read the rules on work done before the event. Disclose that earlier work, and build only the challenge-specific layer during the hackathon.

**After the demo, two tracks run in parallel.**

| Track | Order |
| --- | --- |
| **A: pilot** | Find a partner → pass the [partner data gate](./10-choose-pilot-evidence.md) → build the data-complete *kecamatan* pilot (crop history, rotation comparison, agency login under [ticket 20](./20-set-farmer-plot-access-rules.md)) → pass the [farmer plan release gate](./19-set-farmer-plan-release-gate.md) → farmer chat. |
| **B: service** | Clear the BIG reuse rights and swap the boundary release → measure the full import cost → run a monthly refresh by hand. The owner runs the service alone until an institutional host (a university or district office) commits; that commitment is the exit condition for Track B. Budget: about $20/month for the runner, tile host, and Neon. Move to a 10-day refresh only when an agency user needs it. |

**Measures of useful decisions**

- Stage 1: the share of flagged *kecamatan* that local field checks confirm, and how often agency users come back.
- Stage 2: agronomist ratings of each review aid, and the pass rates on the independent check set.
- Chat: farmer plans that are approved and followed, then the season's result compared with the KATAM baseline.
- Make no "better than KATAM" claim before the stage-2 held-out check passes.

**Outside the first release:** BIG geometry, the pilot and all local records, crop history, the rotation comparison UI, automatic refresh, a separate worker service, PostGIS request-time queries, AquaCrop, named crop classification, agency login, farmer chat, and areas outside Java.

Dates are from [spaceappschallenge.org](https://www.spaceappschallenge.org/), checked 28 September 2026.
