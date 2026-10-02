import { Tabs, TabsList, TabsTrigger } from "@paddy-field/ui/components/tabs";
import Link from "next/link";

export function FarmSwitcher({
  farms,
  farmId,
}: {
  farms: { id: string; name: string }[];
  farmId: string;
}) {
  return (
    <Tabs value={farmId}>
      <TabsList aria-label="Farm">
        {farms.map((farm) => {
          return (
            <TabsTrigger
              key={farm.id}
              value={farm.id}
              nativeButton={false}
              render={<Link href={`/?farm=${farm.id}`} />}
            >
              {farm.name}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
