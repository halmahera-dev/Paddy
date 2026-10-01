"use client";

import { Map, MapControls } from "@/components/ui/map";

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
