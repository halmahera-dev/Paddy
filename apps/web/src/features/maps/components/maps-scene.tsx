"use client";

import { Map, MapControls, type MapViewport } from "@/components/ui/map";
import { useState } from "react";

export default function MapsScene() {
  const [viewport, setViewport] = useState<MapViewport>({
    // longitude, latitude
    center: [107.6018721, -6.9034477],
    zoom: 8,
    bearing: 0,
    pitch: 0,
  });

  return (
    <Map
      viewport={viewport}
      onViewportChange={setViewport}
      styles={{ light: "https://tiles.openfreemap.org/styles/bright" }}
    >
      <MapControls
        className="mt-16"
        position="top-right"
        showZoom
        showCompass
        showLocate
        showFullscreen
      />
    </Map>
  );
}
