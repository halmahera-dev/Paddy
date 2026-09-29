# Decide the role of a chat assistant

Type: `grilling`  
Status: resolved  
Parent: [Field Shift Java decision map](../map.md)
Blocked by: none

## Question

Does Field Shift need a chat assistant, and if so, what job does it do next to the three map modes? Decide who asks questions and which questions; whether the chat only reads prepared *kecamatan* summaries, source records, and checked local evidence, or also gives advice; how each answer shows its source, period, coverage, and claim type (observed, inferred, unknown); how it withholds unsupported results under the pilot input contract; and whether it belongs in the first milestone or after the partner data gate. Use AgroAskAI (arXiv 2512.14910) as a contrast: a chat-first, multi-agent LLM tool for farmers without field-level evidence.

## Answer

Field Shift will add a **farmer chat entry point** after a checked local pilot. The three equal map modes remain for agency staff and researchers. Java-wide *kecamatan* summaries do not support plot advice, so the first Java-wide milestone has no farmer crop plan.

The first farmer plan covers **crop choice, planting window, and water** for a checked local plot. A partner must confirm the farmer–plot link. Approved local rules and checked data produce the plan options and numbers. Chat explains those results; it does not invent a crop choice, planting date, or water amount. A named local agronomist must approve each plan before chat gives it to the farmer as advice. While review is pending, chat shows status and missing facts, not the draft plan.

Each answer identifies its source, date or period, area and scale, coverage, and claim type: checked fact, estimate, inference, unknown, or approved advice. It links back to the relevant evidence or reviewed plan. When the plot link or a required fact is missing, chat explains the gap, asks for what is needed, and gives only general information with sources. A missing input blocks only the part of a plan that needs it; it does not turn an area estimate into a plot fact. Farmer-facing fertilizer and pest treatment are outside this first chat plan.

The release follows the [partner data gate](./10-choose-pilot-evidence.md) and the [rotation evidence standard](./12-set-rotation-evidence-standard.md). Independent validation and partner sign-off for farmer advice need a separate release-gate decision. AgroAskAI is a useful contrast: it studies a chat-first, multi-agent tool for farmer enquiries, while Field Shift's farmer answer is tied to a checked plot, approved local rules, and a named reviewer. Its paper does not set Field Shift's validation standard: [AgroAskAI](https://arxiv.org/abs/2512.14910).

The user confirmed this decision in the live discussion.
