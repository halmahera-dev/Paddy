"use client";

import {
    Map,
    MapControls,
    MapGeoJSON,
    MapMarker,
    MarkerContent,
    useMap,
    type MapViewport,
} from "@/components/ui/map";
import { sampleAreas, type SampleArea } from "@/features/maps/maps-sample-data";
import { HugeiconsIcon } from "@hugeicons/react";
import { PanelRightCloseIcon, PanelRightOpenIcon } from "@hugeicons/core-free-icons";
import type { FeatureCollection, Polygon } from "geojson";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type Mode = "screening" | "history" | "comparison";

const modes: { id: Mode; label: string }[] = [
  { id: "screening", label: "Screening" },
  { id: "history", label: "Crop history" },
  { id: "comparison", label: "Compare plans" },
];

// Soil moisture readings in this probe range roughly 0.08-0.24 m3/m3.
// A fixed 0-0.4 domain keeps the two bars comparable across areas.
const MOISTURE_DOMAIN_MAX = 0.4;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const handleChange = () => setReduced(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}

export default function MapsScene() {
  const [viewport, setViewport] = useState<MapViewport>({
    center: sampleAreas[0].center,
    zoom: 9,
    bearing: 0,
    pitch: 0,
  });
  const [selectedId, setSelectedId] = useState<string>(sampleAreas[0].id);
  const [selectedCellIndex, setSelectedCellIndex] = useState(() =>
    largestCellIndex(sampleAreas[0]),
  );
  const [mode, setMode] = useState<Mode>("screening");
  const [showSources, setShowSources] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [markedIds, setMarkedIds] = useState<string[]>([]);
  const [firstCrop, setFirstCrop] = useState("Rice");
  const [secondCrop, setSecondCrop] = useState("Maize");
  const reducedMotion = usePrefersReducedMotion();

  const area = sampleAreas.find((item) => item.id === selectedId) ?? sampleAreas[0];
  const clearShare = (area.clearPixels / area.validPixels) * 100;
  const isMarked = markedIds.includes(area.id);
  const selectedCell = area.imergCells[selectedCellIndex] ?? area.imergCells[0];
  const dominantCellIndex = largestCellIndex(area);
  const summary = summarizeArea(area, clearShare);

  const cellCollection = useMemo<
    FeatureCollection<Polygon, { cellIndex: number; areaShare: number }>
  >(
    () => ({
      type: "FeatureCollection",
      features: area.imergCells.map((cell, cellIndex) => {
        const [longitude, latitude] = cell.center;
        return {
          type: "Feature",
          properties: { cellIndex, areaShare: cell.areaShare },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [longitude - 0.05, latitude - 0.05],
                [longitude + 0.05, latitude - 0.05],
                [longitude + 0.05, latitude + 0.05],
                [longitude - 0.05, latitude + 0.05],
                [longitude - 0.05, latitude - 0.05],
              ],
            ],
          },
        };
      }),
    }),
    [area],
  );

  function selectArea(nextArea: SampleArea) {
    setSelectedId(nextArea.id);
    setSelectedCellIndex(largestCellIndex(nextArea));
    setShowSources(false);
    setViewport({ center: nextArea.center, zoom: 9, bearing: 0, pitch: 0 });
  }

  function toggleMarkedArea() {
    setMarkedIds((current) =>
      current.includes(area.id) ? current.filter((id) => id !== area.id) : [...current, area.id],
    );
    toast(isMarked ? `Removed ${area.name} from local check` : `Marked ${area.name} for local check`, {
      description: "Kept in this browser session only.",
    });
  }

  function exportEvidence() {
    const rows = [
      ["area", "code", "source", "measure", "value", "unit", "period", "note"],
      [
        area.name,
        area.id,
        "IMERG Late V07C",
        "selected grid cell " + (selectedCellIndex + 1) + " rain",
        selectedCell.rainMm,
        "mm/day",
        "1 Sep 2026",
        "center " +
          selectedCell.center.join(" / ") +
          "; " +
          (selectedCell.areaShare * 100).toFixed(1) +
          "% of area; " +
          selectedCell.sampleCount +
          " source samples",
      ],
      [
        area.name,
        area.id,
        "IMERG Late V07C",
        "daily rain",
        area.rainMm,
        "mm/day",
        "1 Sep 2026",
        area.rainCells + " overlapping cells",
      ],
      [
        area.name,
        area.id,
        "POWER",
        "daily mean temperature",
        area.temperatureC,
        "°C",
        "1 Sep 2026",
        "centroid point",
      ],
      [
        area.name,
        area.id,
        "SMAP SPL4SMGP V008",
        "surface soil moisture",
        area.surfaceMoisture,
        "m³/m³",
        "one sample snapshot",
        area.smapCellInside ? "cell center inside area" : "nearest cell center outside area",
      ],
      [
        area.name,
        area.id,
        "SMAP SPL4SMGP V008",
        "root-zone soil moisture",
        area.rootZoneMoisture,
        "m³/m³",
        "one sample snapshot",
        area.smapCellInside ? "cell center inside area" : "nearest cell center outside area",
      ],
      [
        area.name,
        area.id,
        "HLS S30 v2",
        "clear pixels",
        area.clearPixels,
        "pixels",
        area.hlsDate,
        area.validPixels + " valid pixels; one scene",
      ],
    ];
    const csv = rows
      .map((row) => row.map((value) => '"' + String(value).replaceAll('"', '""') + '"').join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "java-evidence-" + area.id + ".csv";
    link.click();
    URL.revokeObjectURL(url);
    toast(`Saved evidence for ${area.name}`, { description: link.download });
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-background text-foreground">
      <button
        type="button"
        onClick={() => setPanelCollapsed((value) => !value)}
        aria-label={panelCollapsed ? "Show panel" : "Hide panel"}
        aria-pressed={!panelCollapsed}
        className="absolute top-4 right-4 z-30 flex size-9 items-center justify-center rounded-md border border-border bg-background/90 text-foreground shadow-md backdrop-blur-md transition-transform duration-100 hover:bg-muted active:scale-95 focus-visible:outline-2 focus-visible:outline-ring"
      >
        <HugeiconsIcon
          icon={panelCollapsed ? PanelRightOpenIcon : PanelRightCloseIcon}
          size={18}
          strokeWidth={2}
        />
      </button>
      <div className="relative min-h-80 flex-1">
        <Map
          viewport={viewport}
          onViewportChange={setViewport}
          styles={{ light: "https://tiles.openfreemap.org/styles/bright" }}
        >
          <MapControls
            position="bottom-left"
            showZoom
            showCompass
            className="md:group-has-data-[state=expanded]/sidebar-wrapper:left-(--sidebar-width) md:group-has-data-[state=expanded]/sidebar-wrapper:translate-x-2"
          />
          <CameraFlyTo
            areaId={area.id}
            center={area.center}
            zoom={9}
            reducedMotion={reducedMotion}
          />
          <MapGeoJSON
            id="imerg-sample-cells"
            data={cellCollection}
            interactive
            onClick={(event) => setSelectedCellIndex(event.feature.properties.cellIndex)}
            fillPaint={{
              "fill-color": [
                "case",
                ["==", ["get", "cellIndex"], selectedCellIndex],
                "#047857",
                "#0f766e",
              ],
              "fill-opacity": [
                "+",
                0.12,
                ["*", ["get", "areaShare"], 0.55],
                ["case", ["==", ["get", "cellIndex"], selectedCellIndex], 0.25, 0],
              ],
            }}
            linePaint={{
              "line-color": [
                "case",
                ["==", ["get", "cellIndex"], selectedCellIndex],
                "#064e3b",
                "#0f766e",
              ],
              "line-width": ["case", ["==", ["get", "cellIndex"], selectedCellIndex], 3, 1.5],
            }}
          />
          <MapMarker
            longitude={area.imergCells[dominantCellIndex].center[0]}
            latitude={area.imergCells[dominantCellIndex].center[1]}
          >
            <MarkerContent className="cursor-default">
              <span className="rounded-full border border-foreground/20 bg-foreground/90 px-1.5 py-0.5 text-xs font-semibold tracking-tight text-background tabular-nums shadow-sm">
                {Math.round(area.imergCells[dominantCellIndex].areaShare * 100)}%
              </span>
            </MarkerContent>
          </MapMarker>
          <MapMarker longitude={area.smapCellCenter[0]} latitude={area.smapCellCenter[1]}>
            <MarkerContent className="cursor-default">
              <span
                className={
                  "block size-5 rounded-full border-2 border-dashed " +
                  (area.smapCellInside ? "border-primary" : "border-muted-foreground")
                }
                title={
                  "SMAP moisture cell center — " +
                  (area.smapCellInside ? "inside this area" : "nearest cell, outside this area")
                }
              />
            </MarkerContent>
          </MapMarker>
        </Map>
      </div>

      {!panelCollapsed && (
      <section className="relative z-10 mt-12 max-h-96 shrink-0 overflow-y-auto border-t border-border bg-background/85 shadow-xl backdrop-blur-lg supports-[backdrop-filter]:backdrop-saturate-150 lg:absolute lg:top-4 lg:right-4 lg:bottom-4 lg:max-h-none lg:w-96 lg:rounded-xl lg:border">
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-xs font-semibold text-foreground/60">Sample area</span>
            <span className="text-xs text-muted-foreground">Sep 2026 samples</span>
          </div>
          <select
            id="sample-area"
            aria-label="Sample area"
            value={area.id}
            onChange={(event) =>
              selectArea(
                sampleAreas.find((item) => item.id === event.target.value) ?? sampleAreas[0],
              )
            }
            className="mt-1 w-full rounded-md border-0 bg-transparent py-1 text-2xl font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {sampleAreas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}, {item.province}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-sm leading-5 font-medium text-foreground/80">{summary}</p>
        </div>

        <div className="px-5 pb-4">
          <ModeSwitch mode={mode} onChange={setMode} onSwitch={() => setShowSources(false)} />

          <div className="mt-5 rounded-lg border border-primary/30 bg-background/85 p-3">
            <p className="text-xs font-semibold text-primary">
              IMERG grid cell {selectedCellIndex + 1} of {area.imergCells.length}
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {selectedCell.rainMm} mm/day rain
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              1 Sep 2026 · {selectedCell.sampleCount} source samples ·{" "}
              {(selectedCell.areaShare * 100).toFixed(1)}% of this kecamatan overlaps the cell.
            </p>
          </div>

          {mode === "screening" && (
            <div className="mt-5 flex flex-col gap-3">
              <EvidenceCard
                title="Rain on 1 Sep"
                value={area.rainMm + " mm/day"}
                source="IMERG Late V07C"
                detail={
                  area.rainCells +
                  " overlapping cells · " +
                  area.rainCoverage.toFixed(1) +
                  "% valid area"
                }
                strength={1}
                strengthReason="1 day of source coverage · one area-weighted read"
              />
              <EvidenceCard
                title="Mean air temperature"
                value={area.temperatureC.toFixed(1) + " °C"}
                source="POWER · 1 Sep"
                detail="Centroid value, not a kecamatan average"
                strength={1}
                strengthReason="1 day of source coverage · centroid point only"
              />
              <div className="rounded-lg border border-border bg-background p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-muted-foreground">Soil moisture</p>
                  <span className="text-right text-xs text-muted-foreground">SMAP · one snapshot</span>
                </div>
                <SoilMoistureBars
                  surface={area.surfaceMoisture}
                  rootZone={area.rootZoneMoisture}
                />
                <p className="mt-2 text-xs leading-4 text-muted-foreground">
                  {area.smapCellInside
                    ? "Cell center lies inside the area."
                    : "Nearest cell center lies outside the area."}
                </p>
                <EvidencePips
                  strength={area.smapCellInside ? 2 : 1}
                  reason="1 three-hour snapshot · nearest grid cell only"
                />
              </div>
              <button
                type="button"
                onClick={toggleMarkedArea}
                className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-transform duration-100 hover:bg-primary/90 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {isMarked ? "Remove local-check mark" : "Mark for local check"}
              </button>
            </div>
          )}

          {mode === "history" && (
            <div className="mt-5 flex flex-col gap-3">
              <EvidenceCard
                title="Named crop history"
                value="Unknown"
                source="Local plot records"
                detail="No checked local records are connected to this sample."
              />
              <div className="rounded-lg border border-border bg-background p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-muted-foreground">Clear satellite view</p>
                  <span className="text-right text-xs text-muted-foreground">
                    HLS S30 · {area.hlsDate}
                  </span>
                </div>
                <p className="mt-1.5 text-xl font-semibold tracking-tight tabular-nums">
                  {Math.round(clearShare)}%
                </p>
                <ClearViewGrid clearShare={clearShare} />
                <p className="mt-2 text-xs leading-4 text-muted-foreground">
                  {area.clearPixels.toLocaleString()} clear of {area.validPixels.toLocaleString()}{" "}
                  valid pixels in one scene.
                </p>
                <EvidencePips strength={1} reason="1 scene · no multi-date cloud check yet" />
              </div>
            </div>
          )}

          {mode === "comparison" && (
            <div className="mt-5 flex flex-col gap-4">
              <p className="rounded-lg bg-secondary p-3 text-xs leading-5 text-secondary-foreground">
                Exploratory example only. No checked plots, water access, soil class, or approved
                local crop rules are connected.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <CropSelect label="Plan A crop" value={firstCrop} onChange={setFirstCrop} />
                <CropSelect label="Plan B crop" value={secondCrop} onChange={setSecondCrop} />
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold">
                  {firstCrop} versus {secondCrop}
                </h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Calendar fit, water demand, and irrigation feasibility are unavailable. A local
                  agronomist needs checked plot data to review these plans.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSources(true)}
                className="w-full rounded-md border border-border px-4 py-2.5 text-sm font-semibold transition-transform duration-100 hover:bg-muted active:scale-95 focus-visible:outline-2 focus-visible:outline-ring"
              >
                Open evidence note
              </button>
            </div>
          )}

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs font-semibold text-foreground/60">Compare sample areas</p>
            <CompareStrip areas={sampleAreas} selectedId={area.id} />

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setShowSources((value) => !value)}
                className="flex-1 rounded-md border border-border px-3 py-2 text-xs font-semibold transition-transform duration-100 hover:bg-muted active:scale-95 focus-visible:outline-2 focus-visible:outline-ring"
              >
                {showSources ? "Hide sources" : "Source evidence"}
              </button>
              <button
                type="button"
                onClick={exportEvidence}
                className="flex-1 rounded-md border border-border px-3 py-2 text-xs font-semibold transition-transform duration-100 hover:bg-muted active:scale-95 focus-visible:outline-2 focus-visible:outline-ring"
              >
                Export CSV
              </button>
            </div>
            {showSources && <SourceEvidence area={area} cellIndex={selectedCellIndex} />}
          </div>
        </div>
      </section>
      )}
    </div>
  );
}

// Moves the map camera to the newly selected area instead of cutting to it,
// so the user keeps their bearings across Java. Skips the very first mount,
// since the initial viewport already centers on it.
function CameraFlyTo({
  areaId,
  center,
  zoom,
  reducedMotion,
}: {
  areaId: string;
  center: [number, number];
  zoom: number;
  reducedMotion: boolean;
}) {
  const { map } = useMap();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (!map) return;
    map.flyTo({ center, zoom, duration: reducedMotion ? 0 : 1200, essential: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaId]);

  return null;
}

function largestCellIndex(area: SampleArea) {
  let largestIndex = 0;
  for (let index = 1; index < area.imergCells.length; index++) {
    if (area.imergCells[index].areaShare > area.imergCells[largestIndex].areaShare) {
      largestIndex = index;
    }
  }
  return largestIndex;
}

// One rule-based sentence built from observed values only. No forecast, no
// drought claim — just what the three readings show today.
function summarizeArea(area: SampleArea, clearShare: number) {
  const rainPart = area.rainMm > 0 ? area.rainMm + " mm/day rain" : "No rain";

  const moistureGap = area.surfaceMoisture - area.rootZoneMoisture;
  const soilPart =
    moistureGap < -0.03
      ? "dry topsoil, wetter below"
      : moistureGap > 0.03
        ? "wetter topsoil than below"
        : "even soil moisture";

  const skyPart =
    clearShare >= 80 ? "mostly clear sky" : clearShare >= 30 ? "partly clouded" : "cloud blocked the view";

  return [rainPart, soilPart, skyPart].join(" · ");
}

function ModeSwitch({
  mode,
  onChange,
  onSwitch,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
  onSwitch: () => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1" aria-label="Map mode">
      {modes.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            onChange(item.id);
            onSwitch();
          }}
          aria-pressed={mode === item.id}
          className={
            "rounded-md px-1 py-2 text-xs font-semibold transition-colors duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-ring " +
            (mode === item.id
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground")
          }
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function SoilMoistureBars({ surface, rootZone }: { surface: number; rootZone: number }) {
  const surfaceWidth = Math.min(100, (surface / MOISTURE_DOMAIN_MAX) * 100);
  const rootZoneWidth = Math.min(100, (rootZone / MOISTURE_DOMAIN_MAX) * 100);

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <MoistureBar label="Surface" value={surface} width={surfaceWidth} />
      <MoistureBar label="Root zone" value={rootZone} width={rootZoneWidth} />
    </div>
  );
}

function MoistureBar({ label, value, width }: { label: string; value: number; width: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="h-2 flex-1 rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: width + "%" }}
        />
      </div>
      <span className="w-12 shrink-0 text-right text-xs tabular-nums text-foreground/80">
        {value.toFixed(3)}
      </span>
    </div>
  );
}

function ClearViewGrid({ clearShare }: { clearShare: number }) {
  const filledCount = Math.round(clearShare);
  const cells = Array.from({ length: 100 }, (_, index) => index < filledCount);

  return (
    <div
      className="mt-2 grid grid-cols-10 gap-0.5"
      role="img"
      aria-label={Math.round(clearShare) + " percent clear satellite view"}
    >
      {cells.map((filled, index) => (
        <span
          key={index}
          className={"aspect-square " + (filled ? "bg-primary" : "bg-muted")}
        />
      ))}
    </div>
  );
}

function EvidencePips({ strength, reason }: { strength: number; reason: string }) {
  return (
    <div className="mt-2 flex items-center gap-1.5" title={reason}>
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Evidence
      </span>
      <span className="flex gap-0.5">
        {Array.from({ length: 4 }, (_, index) => (
          <span
            key={index}
            className={
              "size-1.5 rounded-full " + (index < strength ? "bg-foreground/70" : "bg-muted")
            }
          />
        ))}
      </span>
    </div>
  );
}

type CompareMetric = {
  label: string;
  read: (area: SampleArea) => number;
};

const compareMetrics: CompareMetric[] = [
  { label: "Temp", read: (a) => a.temperatureC },
  { label: "Surface", read: (a) => a.surfaceMoisture },
  { label: "Root", read: (a) => a.rootZoneMoisture },
  { label: "Clear", read: (a) => a.clearPixels / a.validPixels },
];

function CompareStrip({
  areas,
  selectedId,
}: {
  areas: readonly SampleArea[];
  selectedId: string;
}) {
  return (
    <div className="mt-2 flex flex-col gap-1.5 text-xs">
      <div className="flex items-center gap-2">
        <span className="w-20 shrink-0" />
        <div className="grid flex-1 grid-cols-4">
          {compareMetrics.map((metric) => (
            <span key={metric.label} className="text-center text-xs text-muted-foreground">
              {metric.label}
            </span>
          ))}
        </div>
      </div>
      {areas.map((rowArea) => (
        <div key={rowArea.id} className="flex items-center gap-2">
          <span
            className={
              "w-20 shrink-0 truncate font-medium " +
              (rowArea.id === selectedId ? "text-foreground" : "text-muted-foreground")
            }
          >
            {rowArea.name}
          </span>
          <div className="grid flex-1 grid-cols-4">
            {compareMetrics.map((metric) => (
              <span key={metric.label} className="flex justify-center">
                <CompareDot
                  rank={relativeRank(
                    metric.read(rowArea),
                    areas.map((item) => metric.read(item)),
                  )}
                  dim={rowArea.id !== selectedId}
                />
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function relativeRank(value: number, values: number[]): "high" | "mid" | "low" {
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  if (value === median) return "mid";
  return value > median ? "high" : "low";
}

function CompareDot({ rank, dim }: { rank: "high" | "mid" | "low"; dim: boolean }) {
  const base = dim ? "border-muted-foreground/40" : "border-primary";
  if (rank === "high") {
    return <span className={"size-2.5 rounded-full border-2 " + base + " bg-current " + (dim ? "text-muted-foreground/40" : "text-primary")} />;
  }
  if (rank === "mid") {
    return <span className={"size-2.5 rounded-full border-2 " + base} />;
  }
  return <span className={"size-1.5 rounded-full border " + base} />;
}

function EvidenceCard({
  title,
  value,
  source,
  detail,
  strength,
  strengthReason,
}: {
  title: string;
  value: string;
  source: string;
  detail: string;
  strength?: number;
  strengthReason?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3.5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <span className="text-right text-xs text-muted-foreground">{source}</span>
      </div>
      <p className="mt-1.5 text-xl font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-xs leading-4 text-muted-foreground">{detail}</p>
      {strength !== undefined && strengthReason && (
        <EvidencePips strength={strength} reason={strengthReason} />
      )}
    </div>
  );
}

function CropSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-xs font-semibold text-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-2 py-2.5 text-sm font-normal focus-visible:outline-2 focus-visible:outline-ring"
      >
        <option>Rice</option>
        <option>Maize</option>
        <option>Soybean</option>
      </select>
    </label>
  );
}

function SourceEvidence({ area, cellIndex }: { area: SampleArea; cellIndex: number }) {
  const cell = area.imergCells[cellIndex] ?? area.imergCells[0];
  return (
    <div className="mt-4 flex flex-col gap-3 rounded-lg bg-muted p-4 text-xs leading-5 text-foreground">
      <h3 className="font-semibold text-foreground">Source evidence · {area.name}</h3>
      <p>
        Area code {area.id}. These values were recorded in a September 2026 import probe. This page
        does not fetch live NASA data.
      </p>
      <ul className="list-inside list-disc space-y-1">
        <li>
          <a
            href="https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGDL_07/summary"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            IMERG Late V07C
          </a>
          : 1 Sep daily rain, area-weighted across {area.rainCells} cells. Selected cell center:{" "}
          {cell.center[0].toFixed(2)}° E, {Math.abs(cell.center[1]).toFixed(2)}° S. Its reading is{" "}
          {cell.rainMm} mm/day from {cell.sampleCount} source samples.
        </li>
        <li>
          <a
            href="https://power.larc.nasa.gov/docs/services/api/temporal/daily/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            POWER
          </a>
          : 1 Sep temperature at the area centroid.
        </li>
        <li>
          <a
            href="https://nsidc.org/data/spl4smgp/versions/8"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            SMAP SPL4SMGP V008
          </a>
          : one nearby moisture grid cell (surface and root zone); center{" "}
          {area.smapCellInside ? "inside" : "outside"} the area.
        </li>
        <li>
          <a
            href="https://lpdaac.usgs.gov/products/hlss30v002/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            HLS S30 v2
          </a>
          : one scene on {area.hlsDate}, clear-pixel count only.
        </li>
      </ul>
      <p>
        BIG June 2026 candidate boundaries were used for the probe. The map shows NASA grid cells,
        not those boundaries or checked fields.
      </p>
    </div>
  );
}
