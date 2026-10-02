"use client";

import { Button } from "@paddy-field/ui/components/button";
import { useState } from "react";

import { Map, MapControls, MapGeoJSON, useMap } from "@/components/ui/map";

type Coordinate = [number, number];
const layerPoint: Coordinate = [107.9, -6.35];

function polygon(vertices: Coordinate[]): GeoJSON.Feature<GeoJSON.Polygon> {
  return {
    type: "Feature",
    properties: {},
    geometry: { type: "Polygon", coordinates: [[...vertices, vertices[0]]] },
  };
}

const fields: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
  type: "FeatureCollection",
  features: Array.from({ length: 16 }, function parcel(_, index) {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const west = layerPoint[0] - 0.003 + column * 0.0016;
    const south = layerPoint[1] - 0.0025 + row * 0.0013;
    const width = 0.00115 + (index % 3) * 0.0001;
    const height = 0.0008 + (index % 2) * 0.0002;
    const skew = ((index % 3) - 1) * 0.00015;
    return {
      ...polygon([
        [west, south],
        [west + width, south + skew],
        [west + width + skew, south + height],
        [west + skew, south + height],
      ]),
      id: `ftw-${index + 1}`,
      properties: { year: 2025 },
    };
  }),
};

const rain = polygon([
  [layerPoint[0] - 0.018, layerPoint[1] - 0.018],
  [layerPoint[0] + 0.018, layerPoint[1] - 0.018],
  [layerPoint[0] + 0.018, layerPoint[1] + 0.018],
  [layerPoint[0] - 0.018, layerPoint[1] + 0.018],
]);

export default function MapsScene() {
  return (
    <div className="relative flex h-full min-h-0 flex-col bg-background text-foreground">
      <div className="relative min-h-80 flex-1">
        <Map
          center={[107.6191, -6.9175]}
          zoom={9}
          styles={{ light: "https://tiles.openfreemap.org/styles/bright" }}
          renderWorldCopies
        >
          <MapLayers />
          <MapControls
            position="bottom-left"
            showZoom
            showCompass
            className="md:group-has-data-[state=expanded]/sidebar-wrapper:left-(--sidebar-width) md:group-has-data-[state=expanded]/sidebar-wrapper:translate-x-2"
          />
        </Map>
      </div>
    </div>
  );
}

function MapLayers() {
  const [showFields, setShowFields] = useState(true);
  const [showRain, setShowRain] = useState(true);
  const { map } = useMap();
  return (
    <>
      {showRain && (
        <MapGeoJSON
          id="nasa-weather"
          data={rain}
          fillPaint={{ "fill-opacity": 0.18 }}
          linePaint={{ "line-width": 1, "line-opacity": 0.35 }}
        />
      )}
      {showFields && (
        <MapGeoJSON
          id="ftw-fields"
          data={fields}
          fillPaint={{ "fill-opacity": 0.28 }}
          linePaint={{ "line-width": 2 }}
        />
      )}
      <div
        className="absolute top-4 right-4 z-20 flex max-w-xs flex-col gap-2 rounded-xl border border-border bg-background p-3 shadow-sm"
        aria-label="Map layers"
      >
        <div className="flex flex-wrap gap-2">
          <Button
            size="lg"
            variant="outline"
            aria-pressed={showFields}
            onClick={function toggleFields() {
              setShowFields(!showFields);
            }}
          >
            FTW fields
          </Button>
          <Button
            size="lg"
            variant="outline"
            aria-pressed={showRain}
            onClick={function toggleRain() {
              setShowRain(!showRain);
            }}
          >
            NASA rain
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={function viewLayers() {
              map?.fitBounds(
                [
                  [layerPoint[0] - 0.02, layerPoint[1] - 0.02],
                  [layerPoint[0] + 0.02, layerPoint[1] + 0.02],
                ],
                { padding: 48, duration: 0 },
              );
            }}
          >
            View layers
          </Button>
        </div>
        {showFields && <p className="text-xs text-muted-foreground">FTW predicted fields · 2025</p>}
        {showRain && (
          <p className="text-xs text-muted-foreground">
            IMERG Late · 42 mm · 2 September–1 October 2026. Area estimate.
          </p>
        )}
      </div>
    </>
  );
}
