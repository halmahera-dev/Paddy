import { Skeleton } from "@paddy-field/ui/components/skeleton";

import { findArea } from "../dashboard-data";
import { AreaRanking } from "./area-ranking";
import { AreaSwitcher } from "./area-switcher";
import { ConditionsCards } from "./conditions-cards";
import { PlansSnapshot } from "./plans-snapshot";
import { RainPanel } from "./rain-panel";
import { SeasonClock } from "./season-clock";
import { WaterGapCard } from "./water-gap-card";

export function AreaDashboard({ areaId }: { areaId: string | undefined }) {
  const area = findArea(areaId);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6 **:data-[slot=card]:bg-gradient-to-t **:data-[slot=card]:from-primary/5 **:data-[slot=card]:to-card **:data-[slot=card]:shadow-xs">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">{area.name}</h1>
        <p className="text-sm text-muted-foreground">
          {area.province} · what the sky says now and what it means for the next season.
        </p>
      </div>
      <AreaSwitcher areaId={area.id} />
      <div className="grid gap-4 @3xl/main:grid-cols-2">
        <SeasonClock />
        <RainPanel area={area} />
      </div>
      <ConditionsCards area={area} />
      <WaterGapCard area={area} />
      <div className="grid gap-4 @3xl/main:grid-cols-2">
        <PlansSnapshot area={area} />
        <AreaRanking areaId={area.id} />
      </div>
    </div>
  );
}

export function AreaDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-8 w-80" />
      <div className="grid gap-4 @3xl/main:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
      <Skeleton className="h-40" />
      <Skeleton className="h-96" />
    </div>
  );
}
