import { SidebarTrigger } from "@paddy-field/ui/components/sidebar";

import MapsScene from "@/features/maps/components/maps-scene";

export default function MapsPage() {
  return (
    <div className="relative h-full w-full">
      <SidebarTrigger
        variant="outline"
        className="absolute top-4 left-4 z-20 md:group-has-data-[state=expanded]/sidebar-wrapper:left-(--sidebar-width) md:group-has-data-[state=expanded]/sidebar-wrapper:translate-x-4"
      />

      <div className="absolute inset-0">
        <MapsScene />
      </div>
    </div>
  );
}
