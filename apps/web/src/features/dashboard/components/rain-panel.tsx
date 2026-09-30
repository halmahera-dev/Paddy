import { Badge } from "@paddy-field/ui/components/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@paddy-field/ui/components/card";

import type { Area } from "../dashboard-data";

function describeRain(mm: number) {
  if (mm === 0) return "No rain";
  if (mm < 5) return "Light rain";
  if (mm < 20) return "Moderate rain";
  return "Heavy rain";
}

export function RainPanel({ area }: { area: Area }) {
  const label = describeRain(area.rainLast24hMm);
  const dropCount = Math.min(area.rainLast24hMm * 4, 48);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardDescription>Rain in the last 24 hours · {area.name}</CardDescription>
        <CardTitle className="flex items-center gap-3 text-2xl font-semibold tabular-nums">
          {area.rainLast24hMm} mm
          <Badge variant="outline">{label}</Badge>
        </CardTitle>
      </CardHeader>
      <div
        role="img"
        aria-label={`${label}: ${area.rainLast24hMm} millimetres in the last 24 hours`}
        className="relative mx-4 h-40 overflow-hidden rounded-2xl bg-gradient-to-b from-sky-500/10 to-amber-500/15"
      >
        {Array.from({ length: dropCount }, function renderDrop(_, index) {
          return (
            <span
              key={index}
              className="rain-drop absolute top-0 h-4 w-px rounded-full bg-muted-foreground/60"
              style={{
                left: `${(index * 37) % 100}%`,
                animationDelay: `-${((index * 13) % 10) / 10}s`,
                animationDuration: `${0.6 + (index % 5) * 0.1}s`,
                "--drop-top": `${(index * 29) % 85}%`,
              } as React.CSSProperties}
            />
          );
        })}
        {area.rainLast24hMm === 0 ? <CrackedGround /> : null}
      </div>
      <p className="px-6 pb-2 text-xs text-muted-foreground">
        Illustrative. IMERG-style rain, 10 km grid cell.
      </p>
    </Card>
  );
}

function CrackedGround() {
  return (
    <svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden className="absolute inset-x-0 bottom-0 h-16 w-full">
      <path
        d="M0 40 L30 32 L50 44 L80 30 L100 46 L130 34 L160 48 L200 36 M50 44 L58 60 M100 46 L92 60 M160 48 L170 60 M80 30 L84 18"
        fill="none"
        className="stroke-muted-foreground/50"
        strokeWidth="1.5"
      />
    </svg>
  );
}
