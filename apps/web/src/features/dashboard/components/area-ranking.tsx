import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@paddy-field/ui/components/card";
import { Progress } from "@paddy-field/ui/components/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@paddy-field/ui/components/table";
import Link from "next/link";

import { areas, rainCover } from "../dashboard-data";

export function AreaRanking({ areaId }: { areaId: string }) {
  const rankedAreas = areas
    .map((area) => ({ area, cover: rainCover(area, "rice", 2) ?? 0 }))
    .sort((a, b) => a.cover - b.cover);

  return (
    <Card>
      <CardHeader>
        <CardDescription>District view preview</CardDescription>
        <CardTitle className="text-xl font-semibold">Largest drought-season water gap for rice</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Area</TableHead>
              <TableHead className="w-1/2">Rain cover</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankedAreas.map(function renderArea({ area, cover }, index) {
              return (
                <TableRow key={area.id} data-state={area.id === areaId ? "selected" : undefined}>
                  <TableCell className="font-medium">
                    <Link href={`/?area=${area.id}`} className="hover:underline">
                      {index + 1}. {area.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Progress className="flex-1" value={cover} aria-label={`${area.name} rain cover`} />
                      <span className="w-10 text-right tabular-nums">{cover}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
