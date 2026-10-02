import { Badge } from "@paddy-field/ui/components/badge";
import { Skeleton } from "@paddy-field/ui/components/skeleton";

import { cropName, describeElapsedDays, estimateCropProgress } from "../crop-progress";
import { getFarm, getFarms } from "../farm-queries";
import { ChosenPlanCard } from "./chosen-plan-card";
import { FarmAlertsTable } from "./farm-alerts-table";
import { FarmMetricCards } from "./farm-metric-cards";
import { FarmRecordCard } from "./farm-record-card";
import { FarmSwitcher } from "./farm-switcher";
import { RainDemandCard } from "./rain-demand-card";

const cardStyle =
  "**:data-[slot=card]:bg-gradient-to-t **:data-[slot=card]:from-primary/5 **:data-[slot=card]:to-card **:data-[slot=card]:shadow-xs";

export async function FarmOverview({ farmId }: { farmId: string | undefined }) {
  const [farm, farms] = await Promise.all([getFarm(farmId), getFarms()]);
  const elapsedDays = describeElapsedDays(estimateCropProgress(farm.cropRecord, farm.asOf));

  return (
    <div className={`flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6 ${cardStyle}`}>
      <div className="mt-4 flex flex-col gap-1">
        <div className="mb-1 flex gap-2">
          <Badge variant="blur">{cropName[farm.cropRecord.crop]}</Badge>
          {elapsedDays && <Badge variant="blur">{elapsedDays} since planting</Badge>}
        </div>
        <h1 className="text-4xl font-semibold">{farm.name}</h1>
        <p className="text-secondary-foreground">
          {farm.subdistrict}, {farm.province}
        </p>
      </div>
      <FarmSwitcher farms={farms} farmId={farm.id} />
      <FarmMetricCards farm={farm} />
      <RainDemandCard farm={farm} />
      <FarmAlertsTable farm={farm} />
      <div className="grid gap-4 @3xl/main:grid-cols-2">
        <ChosenPlanCard farm={farm} />
        <FarmRecordCard farm={farm} />
      </div>
    </div>
  );
}

export function FarmOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-80" />
      </div>
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
      <Skeleton className="h-96" />
      <Skeleton className="h-64" />
      <div className="grid gap-4 @3xl/main:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}
