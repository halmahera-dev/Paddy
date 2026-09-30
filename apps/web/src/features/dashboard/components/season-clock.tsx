import { Badge } from "@paddy-field/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@paddy-field/ui/components/card";

import { seasons } from "../dashboard-data";

const radius = 40;
const seasonGap = 2;
const seasonLength = 100 / seasons.length;

function getSeasonClock(today: Date) {
  const yearStart = new Date(today.getFullYear() - (today.getMonth() < 10 ? 1 : 0), 10, 1);
  const nextYearStart = new Date(yearStart.getFullYear() + 1, 10, 1);
  const dayMs = 24 * 60 * 60 * 1000;
  const yearShare = (today.getTime() - yearStart.getTime()) / (nextYearStart.getTime() - yearStart.getTime());
  const seasonIndex = Math.min(Math.floor(yearShare * seasons.length), seasons.length - 1);
  const nextSeason = seasons[(seasonIndex + 1) % seasons.length];
  const nextSeasonStart = new Date(yearStart.getFullYear(), 10 + (seasonIndex + 1) * 4, 1);
  const daysToNextSeason = Math.ceil((nextSeasonStart.getTime() - today.getTime()) / dayMs);
  return { yearShare, season: seasons[seasonIndex], nextSeason, daysToNextSeason };
}

export function SeasonClock() {
  const { yearShare, season, nextSeason, daysToNextSeason } = getSeasonClock(new Date());
  const angle = yearShare * 2 * Math.PI - Math.PI / 2;
  const markerX = 50 + radius * Math.cos(angle);
  const markerY = 50 + radius * Math.sin(angle);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Season clock</CardDescription>
        <CardTitle className="text-2xl font-semibold">{season.label} season</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <svg
          viewBox="0 0 100 100"
          role="img"
          aria-label={`Now: ${season.label} season. ${nextSeason.label} season starts in ${daysToNextSeason} days.`}
          className="size-56"
        >
          {seasons.map(function renderArc(arcSeason, index) {
            return (
              <circle
                key={arcSeason.key}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={arcSeason.color}
                strokeWidth="9"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray={`${seasonLength - seasonGap} ${100 - seasonLength + seasonGap}`}
                strokeDashoffset={-index * seasonLength - seasonGap / 2}
                transform="rotate(-90 50 50)"
                opacity={arcSeason.key === season.key ? 1 : 0.35}
              />
            );
          })}
          <circle cx={markerX} cy={markerY} r="6" className="fill-background stroke-foreground" strokeWidth="2.5" />
          <text x="50" y="47" textAnchor="middle" className="fill-foreground text-[9px] font-semibold">
            {daysToNextSeason} days
          </text>
          <text x="50" y="58" textAnchor="middle" className="fill-muted-foreground text-[5px]">
            to {nextSeason.label.toLowerCase()} season
          </text>
        </svg>
        <ul className="flex flex-wrap justify-center gap-2">
          {seasons.map(function renderLegend(legendSeason) {
            return (
              <li key={legendSeason.key}>
                <Badge variant="outline">
                  <span className="size-2 rounded-full" style={{ background: legendSeason.color }} />
                  {legendSeason.label} · {legendSeason.months}
                </Badge>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
