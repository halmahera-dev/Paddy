"use client";

import { SidebarTrigger } from "@tigris/ui/components/sidebar";
import dynamic from "next/dynamic";

const WarehouseScene = dynamic(() => import("@/features/warehouse/components/warehouse-scene"), {
  loading: () => <div className="h-full w-full bg-[#0d1719]" />,
  ssr: false,
});

export default function WarehousePage() {
  return (
    <div className="relative h-full min-h-0">
      <SidebarTrigger className="absolute top-4 left-4 z-20 border-white/10 border-t-white/20 bg-[#101b1dcc] text-white shadow-lg backdrop-blur-md transition duration-100 hover:bg-[#172629] active:scale-[0.97]" />
      <WarehouseScene />
    </div>
  );
}
