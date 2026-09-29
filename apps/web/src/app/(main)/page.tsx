import { Suspense } from "react";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { SectionCards } from "@/components/section-cards";
import { Skeleton } from "@paddy-field/ui/components/skeleton";

import data from "./dashboard-data.json";

export default function HomePage() {
  return (
    <div className="@container/main flex min-h-0 flex-1 flex-col overflow-y-auto">
      <PageHeader title="Home" />

      <Suspense
        fallback={
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Skeleton className="mx-4 h-4 w-48 lg:mx-6" />
            <Skeleton className="mx-4 h-4 w-full lg:mx-6" />
            <Skeleton className="mx-4 h-4 w-full lg:mx-6" />
          </div>
        }
      >
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </Suspense>
    </div>
  );
}
