"use client";

import { MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import Image from "next/image";

const data = [
  {
    name: "Total",
    count: 100,
    fill: "#FFFFFF",
  },
  {
    name: "Girls",
    count: 50,
    fill: "#FAE27C",
  },
  {
    name: "Boys",
    count: 50,
    fill: "#C3EBFA",
  },
];

export default function CountCart() {
  return (
    <Card className="flex flex-col border-none size-full rounded-xl">
      <CardHeader className="pb-0 px-4 pt-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">Students</span>
          <MoreHorizontal className="size-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full relative h-[75%] pb-0 px-4">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={30}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          className="absolute italic top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          width={50}
          height={50}
          alt="male-female icon"
        />
      </CardContent>
      <CardFooter className="flex justify-center gap-16 pb-4">
        <div className="flex flex-col gap-1">
          <div className="size-5 rounded-full bg-skyBlue" />
          <h2 className="font-bold">6,9420</h2>
          <h3 className="text-xs text-muted-foreground">Boys (70%)</h3>
        </div>

        <div className="flex flex-col gap-1">
          <div className="size-5 rounded-full bg-skyYellow" />
          <h2 className="font-bold">6,9420</h2>
          <h3 className="text-xs text-muted-foreground">Girls (30%)</h3>
        </div>
      </CardFooter>
    </Card>
  );
}
