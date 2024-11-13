import { MoreHorizontal } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CountCart from "./count-chart";
import prisma from "@/lib/prisma";

export default async function CountChartContainer() {
  const data = await prisma.student.groupBy({
    by: ["sex"],
    _count: true,
  });

  const boys = data.find((d) => d.sex === "MALE")?._count || 0;
  const girls = data.find((d) => d.sex === "FEMALE")?._count || 0;

  return (
    <Card className="flex flex-col border-none size-full rounded-xl">
      <CardHeader className="pb-0 px-4 pt-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">Students</span>
          <MoreHorizontal className="size-4" />
        </CardTitle>
      </CardHeader>
      <CountCart boys={boys} girls={girls} />
      <CardFooter className="flex justify-center gap-16 pb-4">
        <div className="flex flex-col gap-1">
          <div className="size-5 rounded-full bg-skyBlue" />
          <h2 className="font-bold">{boys}</h2>
          <h3 className="text-xs text-muted-foreground">
            Boys ({Math.round((boys / (boys + girls)) * 100)} %)
          </h3>
        </div>

        <div className="flex flex-col gap-1">
          <div className="size-5 rounded-full bg-skyYellow" />
          <h2 className="font-bold">{girls}</h2>
          <h3 className="text-xs text-muted-foreground">
            Girls ({Math.round((girls / (boys + girls)) * 100)}%)
          </h3>
        </div>
      </CardFooter>
    </Card>
  );
}
