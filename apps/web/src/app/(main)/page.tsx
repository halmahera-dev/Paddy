import type { Metadata } from "next";

import { Suspense } from "react";

import { PageHeader } from "@/components/page-header";
import {
  AreaDashboard,
  AreaDashboardSkeleton,
} from "@/features/dashboard/components/area-dashboard";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage({ searchParams }: { searchParams: Promise<{ area?: string }> }) {
  return (
    <div className="@container/main flex min-h-0 flex-1 flex-col overflow-y-auto">
      <PageHeader title="Home" />

      <Suspense fallback={<AreaDashboardSkeleton />}>
        {searchParams.then(function renderDashboard({ area }) {
          return <AreaDashboard areaId={area} />;
        })}
      </Suspense>
    </div>
  );
}
