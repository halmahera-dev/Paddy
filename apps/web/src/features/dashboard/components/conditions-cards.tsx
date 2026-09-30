import { Badge } from "@paddy-field/ui/components/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@paddy-field/ui/components/card";
import { Progress } from "@paddy-field/ui/components/progress";

import type { Area } from "../dashboard-data";

function describeAgainstNormal(value: number, normal: number) {
  if (value < normal * 0.85) return "Drier than normal";
  if (value > normal * 1.15) return "Wetter than normal";
  return "Near normal";
}

export function ConditionsCards({ area }: { area: Area }) {
  const conditions = [
    {
      label: "Surface moisture",
      value: `${(area.surfaceMoisture * 100).toFixed(1)}%`,
      share: area.surfaceMoisture / area.normalSurfaceMoisture,
      note: describeAgainstNormal(area.surfaceMoisture, area.normalSurfaceMoisture),
      source: "SMAP L4 · 9 km grid",
    },
    {
      label: "Root-zone moisture",
      value: `${(area.rootZoneMoisture * 100).toFixed(1)}%`,
      share: area.rootZoneMoisture / area.normalRootZoneMoisture,
      note: describeAgainstNormal(area.rootZoneMoisture, area.normalRootZoneMoisture),
      source: "SMAP L4 · 9 km grid",
    },
    {
      label: "Air temperature",
      value: `${area.temperatureC.toFixed(1)} °C`,
      share: null,
      note: "Daily mean",
      source: "POWER · 50 km grid",
    },
    {
      label: "Clear sky",
      value: `${Math.round(area.clearSkyShare * 100)}%`,
      share: area.clearSkyShare,
      note: "Usable satellite pixels",
      source: "HLS · 30 m pixels",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {conditions.map(function renderCondition(condition) {
        return (
          <Card key={condition.label}>
            <CardHeader>
              <CardDescription>{condition.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">{condition.value}</CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              {condition.share === null ? null : (
                <Progress className="w-full" value={Math.min(condition.share, 1) * 100} aria-label={condition.label} />
              )}
              <Badge variant="outline">{condition.note}</Badge>
              <span className="text-xs text-muted-foreground">{condition.source} · illustrative</span>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
