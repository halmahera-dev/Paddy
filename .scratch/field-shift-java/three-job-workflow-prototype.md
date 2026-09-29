# Three-job workflow prototype

**Question:** How should one map selection support area screening, crop history, and rotation comparison for government teams, district staff, and researchers?

This is a rough planning artifact. It shows states and actions, not real data or a finished screen. The existing [map layout preview](./area-screening-mockup.html) shows the likely page shape.

```text
MAPS                                      Selected area: Kecamatan A
                                           Area data revision: 2026-09 example
  [Area screening] [Crop history] [Rotation comparison]
  ------------------------------------------------------------------------
  Java map with kecamatan boundaries       AREA SCREENING
  and FTW predicted outlines               Rain gap: [value or unavailable]
                                           Source: IMERG | period | coverage
  Select any kecamatan ------------------> Heat: [value or unavailable]
                                           Source: POWER | period | coverage
                                           Soil moisture: [value or unavailable]
                                           Source: SMAP | period | coverage
                                           [Open source evidence]
                                           [Mark area for local check]
```

The three modes are equal tabs. A selected *kecamatan* stays selected when the user changes mode. None requires completion of another mode. The map stays visible as the location anchor.

## Crop history mode

```text
Selected area: Kecamatan A                CROP HISTORY
  [Area screening] [Crop history] [Rotation comparison]
                                           Area crop cycles: [inferred timing]
                                           Source: HLS | period | usable pixels
                                           Named crops: Unknown
                                           Checked local plot records: None
                                           [Open source evidence]
                                           [Export evidence]
```

When a partner later supplies a checked farming zone and plot records, the area selector can show that zone under its parent *kecamatan*. The panel then separates dated local crop names from remotely inferred cycle timing and states record coverage. A user can inspect a plot only when its ID and geometry have been checked. FTW outlines are still marked as predictions.

## Rotation comparison mode

```text
Selected area: Kecamatan A                ROTATION COMPARISON
  [Area screening] [Crop history] [Rotation comparison]
                                           Plan A: crop + planting window
                                           Plan B: crop + planting window
                                           [Compare example plans]

                                           Calendar fit: [result or unknown]
                                           Crop water demand: [result or unknown]
                                           Rain exposure: [result or unknown]
                                           Soil water gap: Needs local soil class
                                           Irrigation feasibility: Needs local facts
                                           KATAM: [dated guidance or unavailable]
                                           [Open evidence note]
```

Before the partner data gate passes, the plans are examples for an area. The evidence note says they are not plot-specific advice. After the gate passes, district staff can choose a checked plot and use its local crop, soil, and water facts. The result remains a scenario for agronomist review until the evidence standard permits a stronger claim.

## End actions

| User | Action from this workflow |
| --- | --- |
| Government or district team | Mark an area for a local check based on dated screening evidence. |
| District staff and agronomist | Open an evidence note for the two plans, KATAM context, missing inputs, and review decision. |
| Researcher | Inspect and export the same source evidence, dates, units, coverage, and calculation version. |

The source evidence view is reached from each mode. It shows the value's geographic unit, source product and version, period, unit, coverage, quality, and data revision. It does not combine observations, inferences, and proposed scenarios into one claim.
