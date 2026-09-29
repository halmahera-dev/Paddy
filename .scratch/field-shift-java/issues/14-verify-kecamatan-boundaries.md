# Verify Java kecamatan boundaries and IDs

Type: `research`  
Status: resolved  
Assignee: heritsam  
Parent: [Field Shift Java decision map](../map.md)
Blocked by: 05

## Question

Which dated, usable boundary release can cover Java's *kecamatan* with stable IDs for map tiles and summary rows? Check source authority, license or use terms, coverage, geometry quality, boundary version, and a path for linking a later checked farming zone. Record how changed or split *kecamatan* IDs would be handled between releases.

## Answer

Use BIG's June 2026 `BATAS_KECAMATAN_AR_2026` as the candidate snapshot for Java-wide screening. BIG publishes the layer and its `KDCPUM` kecamatan codes. A six-province API check found 2,157 polygons, including 2,146 unique usable codes and 11 unallocated polygons. A 60-polygon geometry sample passed validity checks, but full geometry, topology, and code-list checks remain part of the import test. BIG describes some boundaries as indicative, so this layer supports dated administrative screening, not checked farming-zone or legal parcel claims.

Join map tiles and summary rows by `(boundary release, KDCPUM)`, not service `OBJECTID`. Freeze the source response and its manifest for each publication. On a later release, compare code lists and geometry, review splits and merges in a crosswalk, and recalculate area summaries. A checked farming zone keeps its own ID and a dated link to the relevant kecamatan release; review zones that cross or change administrative borders.

The portal marks the layer open, but no specific terms for copying and republishing its geometry as our own vector tiles were found. The source is suitable for a limited technical test; public tile publication remains gated on explicit reuse terms. See the [source check and API sample](../../../docs/research/java-kecamatan-boundaries.md). That report records the source links, counts, method, and remaining checks.
