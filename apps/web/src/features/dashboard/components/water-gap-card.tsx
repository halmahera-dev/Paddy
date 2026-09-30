import { Badge } from "@paddy-field/ui/components/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@paddy-field/ui/components/card";

import {
  type Area,
  monthLabels,
  rainCover,
  riceNeedByMonth,
  seasonRainMm,
  seasons,
} from "../dashboard-data";
import { WaterGapChart } from "./water-gap-chart";

export function WaterGapCard({ area }: { area: Area }) {
  const data = area.rainByMonth.map(function toRow(rain, index) {
    return {
      month: monthLabels[index],
      rain,
      need: riceNeedByMonth[index],
      color: seasons[Math.floor(index / 4)].color,
    };
  });
  const droughtCover = rainCover(area, "rice", 2);
  const droughtGapMm = riceNeedByMonth.slice(8).reduce((sum, mm) => sum + mm, 0) - seasonRainMm(area, 2);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Normal rain vs rice water need · {area.name}</CardDescription>
        <CardTitle className="text-2xl font-semibold">
          Drought season: rain covers {droughtCover}% of rice need
        </CardTitle>
      </CardHeader>
      <CardContent>
        <WaterGapChart data={data} />
      </CardContent>
      <CardFooter className="flex-wrap gap-2">
        {seasons.map(function renderLegend(season) {
          return (
            <Badge key={season.key} variant="outline">
              <span className="size-2 rounded-full" style={{ background: season.color }} />
              {season.label}
            </Badge>
          );
        })}
        <Badge variant="secondary">Dashed line: rice water need</Badge>
        <Badge variant="secondary">Drought gap: {droughtGapMm} mm</Badge>
      </CardFooter>
    </Card>
  );
}
