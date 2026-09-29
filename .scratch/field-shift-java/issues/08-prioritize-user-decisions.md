# Prioritize the user decisions

Type: `grilling`  
Status: resolved  
Parent: [Field Shift Java decision map](../map.md)

## Question

For government teams, district agriculture offices, and researchers, what concrete decision does each of the three product jobs support: finding areas that need support, studying past crop patterns, and comparing crop rotation options? Which job leads the first end-to-end workflow, and how do the other two feed it? Define a user, a real decision, and the action taken from the result. Keep all three jobs in the long-term plan.

## Answer

| Job | Main user and decision | Action from the result |
| --- | --- | --- |
| Find areas that need support | Government or district team decides which zones need a closer local check because their rain, heat, or crop-timing indicators warrant attention. | Choose areas for local checks; do not assign support from a NASA grid value alone. |
| Study past crop patterns | District staff or researchers decide whether recorded crop sequences and observed cycle timing are clear enough to use in an analysis. | Show missing or uncertain crop names as **unknown**. Pass only checked crop names to a comparison. Do not create a local check list from this view. |
| Compare rotation options | District staff and an agronomist decide which proposed plan merits local review under known calendar and water limits. | Produce an agronomist review note with the two plans, evidence, KATAM context, and unresolved inputs. Do not present an unvalidated recommendation to farmers. |

All three jobs are available in the first workflow; area screening is not the sole lead. A zone-level exploratory comparison can run with labeled example plans. Checked plot-level history and advice become available only after the [partner data gate](./10-choose-pilot-evidence.md) passes.

**Navigation decision:** Maps has three equal modes—area screening, crop history, and rotation comparison. They share a selected zone, and none requires the user to finish another mode first.

**Researcher decision:** researchers use the same three modes to inspect source evidence and export it for analysis. No separate research workflow is needed for the first proof.

**Crop-history unknown:** when a local crop name or date is missing or conflicts with imagery, show **unknown** with the available dates and sources. Do not create a local check list. Imagery alone does not confirm a crop name.

The current Maps screen already gives the map most of the page, with navigation in a left sidebar. The [layout preview](../area-screening-mockup.html) keeps that map as the main surface: screening controls sit over the map, and a selected zone opens details for conditions, history, and comparison. This is a layout proposal, not a finished product screen or real indicator data.
