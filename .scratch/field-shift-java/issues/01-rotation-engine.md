# Choose a rotation comparison engine

Type: `research`  
Status: resolved  
Parent: [Field Shift Java decision map](../map.md)

## Question

What is the simplest scientifically defensible computation for comparing two crop rotation plans in a Java pilot? Research official crop-model and agronomy sources for rice and likely secondary crops. Identify required inputs, outputs for water and soil trade-offs, model scale, calibration data, and validation needs. Compare a transparent rule-based baseline with one established model, and state which claims each can support. Do not treat unmeasured soil-health change or future yield as an observed result.

## Answer

Recommend a transparent crop-calendar and FAO-56 water-screening baseline first, then pilot FAO AquaCrop 7.3 for rice, maize, and soybean water and yield scenarios on representative field types after local calibration and held-out validation. AquaCrop carries soil water and salinity across crop runs but does not measure rotation-driven soil-health change. Show measured soil status and rotation hypotheses separately. The pilot needs local crop dates, cultivar, soil profile, irrigation records, observed yields and soil-water or canopy checks. [Research report](../../../docs/research/java-rotation-engine.md).
