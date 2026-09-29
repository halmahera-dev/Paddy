# Map the flow for each service

Type: `grilling`  
Status: resolved  
Parent: [Field Shift Java decision map](../map.md)

## Question

For the first working proof, draw both kinds of technical flow: (1) how each NASA, FTW, and local data service enters the system, and (2) how the app finds zones that need support, studies past crop patterns, and compares rotation plans. For each path, show access, processing, stored result, API or query, screen output, missing-data behavior, and what another path consumes. Make a rough flow diagram the user can react to, then decide which steps the services share.

## Draft for review

[Flow for each service](../service-flows-draft.md)

## Answer

The user chose the layered technical flow **data → processing services → backend → frontend**. The processing layer has logical field/zone, climate/water, crop-history, and rotation functions; it does not require a separate deployed server for each function in the first proof. FTW PMTiles go through a browser tile path, while a checked FTW subset and NASA/local inputs pass through prepared pilot data. The backend serves area, crop-history, and rotation views from shared zone data. For the first proof, POWER is fetched live through the backend with a source-cell cache; IMERG, HLS, and SMAP are clearly dated pilot samples. The [revised flow draft](../service-flows-draft.md) holds the diagrams and source-by-source detail. Storage, job runner, local input rules, and deployment remain open for later tickets.
