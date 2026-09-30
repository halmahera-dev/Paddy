import { Tabs, TabsList, TabsTrigger } from "@paddy-field/ui/components/tabs";
import Link from "next/link";

import { areas } from "../dashboard-data";

export function AreaSwitcher({ areaId }: { areaId: string }) {
  return (
    <Tabs value={areaId}>
      <TabsList aria-label="Area">
        {areas.map(function renderArea(area) {
          return (
            <TabsTrigger
              key={area.id}
              value={area.id}
              nativeButton={false}
              render={<Link href={`/?area=${area.id}`} />}
            >
              {area.name}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
