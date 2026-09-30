import { Badge } from "@paddy-field/ui/components/badge";
import { buttonVariants } from "@paddy-field/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@paddy-field/ui/components/card";
import { Item, ItemContent, ItemGroup, ItemHeader } from "@paddy-field/ui/components/item";
import Link from "next/link";

import { type Area, cropShortName, plans, rainCover, seasons } from "../dashboard-data";

function rankPlans(area: Area) {
  return plans
    .map(function withCovers(plan) {
      const covers = plan.crops.map((crop, seasonIndex) => rainCover(area, crop, seasonIndex));
      const worstCover = Math.min(...covers.map((cover) => cover ?? 100));
      return { ...plan, covers, worstCover };
    })
    .sort((a, b) => b.worstCover - a.worstCover);
}

export function PlansSnapshot({ area }: { area: Area }) {
  const rankedPlans = rankPlans(area);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Next three seasons · {area.name}</CardDescription>
        <CardTitle className="text-xl font-semibold">Rotation plans, least water risk first</CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {rankedPlans.map(function renderPlan(plan, planIndex) {
            return (
              <Item key={plan.id} variant="outline" className="flex-col items-stretch">
                <ItemHeader className="justify-start">
                  <Badge variant={planIndex === 0 ? "default" : "outline"}>
                    {planIndex === 0 ? "Plan to consider" : `Choice ${planIndex + 1}`}
                  </Badge>
                  {plan.id === "rrr" ? <Badge variant="secondary">Today’s habit</Badge> : null}
                </ItemHeader>
                <ItemContent>
                  <ol className="grid grid-cols-3 gap-2 text-sm">
                    {plan.crops.map(function renderSeason(crop, seasonIndex) {
                      const cover = plan.covers[seasonIndex];
                      return (
                        <li key={seasons[seasonIndex].key} className="flex flex-col">
                          <span className="text-xs text-muted-foreground">{seasons[seasonIndex].label}</span>
                          <span className="font-medium">{cropShortName[crop]}</span>
                          <span className="tabular-nums text-muted-foreground">
                            {cover === null ? "Rest" : `${cover}% rain cover`}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </ItemContent>
              </Item>
            );
          })}
        </ItemGroup>
      </CardContent>
      <CardFooter>
        <Link href="/briefing" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Explore soil and priority
        </Link>
      </CardFooter>
    </Card>
  );
}
