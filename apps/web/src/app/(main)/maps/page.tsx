import { PageHeader } from "@/components/page-header";
import MapsScene from "@/features/maps/components/maps-scene";

export default function MapsPage() {
  return (
    <div className="relative h-full w-full">
      <PageHeader title="Maps" className="absolute inset-x-0 top-0" />

      <div className="absolute inset-0">
        <MapsScene />
      </div>
    </div>
  );
}
