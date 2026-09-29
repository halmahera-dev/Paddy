# Set the farmer plan release gate

Type: `grilling`  
Status: resolved  
Parent: [Field Shift Java decision map](../map.md)
Blocked by: 17

## Question

What evidence and approvals must pass before a checked pilot can release crop-choice, planting-window, and water plans to farmers through chat? Set the independent test design and success limits by land type, the local rules and source revisions that may produce a plan, the named agronomist's review duty, partner sign-off, and when a changed or stale plan must be reviewed again. Keep this gate separate from the earlier unvalidated agronomist review aid and from the Java-wide screening release.

## Answer

The farmer advice release is a **single gate for the checked pilot**. It follows the [partner data gate](./10-choose-pilot-evidence.md) and the [rotation evidence standard](./12-set-rotation-evidence-standard.md). Java-wide screening and the unvalidated agronomist review aid can proceed without this gate; neither may be presented as farmer advice.

Before looking at independent test results, the pilot partner and a named local agronomist write and approve a test plan. They define the pilot area, included crops and land types, held-out whole plot-seasons, sample size, success limits for each rainfed and irrigated group and each crop-choice, planting-window, and water output, matching observed measures, and how missing records count. Keep the held-out plot-seasons out of rule fitting. Check planting windows and water estimates against dated local observations, report error and missing coverage by group, and check crop-choice claims against the outcome or checked constraint named in the test plan. Show dated KATAM guidance as context and record disagreements; do not claim superiority without a test designed for that claim. A result with too few usable observations cannot pass its limit.

**All included groups and outputs must pass their own pre-set limits before any farmer advice is released.** One failed or untestable part holds the whole farmer release closed. Staff may still use the clearly marked agronomist review aid. The partner signs off on the pilot release after reviewing the full test report and its limits. The release applies to the tested pilot area, crops, land types, outputs, and approved rule set; expansion needs new evidence and sign-off.

Plans use checked local plot facts, approved local crop, calendar, soil, and water rules, and dated, versioned source data. The named agronomist approves each rule for its stated area and period and reviews each individual plan before chat may show it as advice. The plan record keeps the plot link, inputs, source versions and periods, rule versions, calculations, limits, reviewer, approval time, and validity period. Chat explains the approved record; it does not make or revise plan numbers. While approval is pending, chat shows status and missing facts, not a draft plan. Missing inputs block the dependent output; because this pilot uses one release gate, an incomplete crop-choice, planting-window, or water output cannot be sent as a partial farmer plan.

The partner and agronomist set a validity period for each plan type before release. A changed checked plot fact, farmer–plot link, approved rule, source revision that changes an output or its quality, or an expired validity period makes an affected plan no longer current advice. Keep its dated record, stop showing it as current advice, and require a new calculation and named agronomist review before chat shows updated advice. A rule or calculation change that moves beyond the tested release needs a new independent check and partner sign-off. A source revision with no effect on the plan or its quality remains recorded but does not by itself require a new review.

The user confirmed the independent held-out test design, partner release sign-off, per-plan agronomist review, and pause-and-review rule. The user chose one release for all pilot outputs: every included group and output must pass before any farmer advice is released.
