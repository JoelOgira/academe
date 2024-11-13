"use client";

import { CardContent } from "@/components/ui/card";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import Image from "next/image";

interface CountChartProps {
  boys: number;
  girls: number;
}

export default function CountCart({ boys, girls }: CountChartProps) {
  const data = [
    {
      name: "Total",
      count: boys + girls,
      fill: "#FFFFFF",
    },
    {
      name: "Girls",
      count: girls,
      fill: "#FAE27C",
    },
    {
      name: "Boys",
      count: boys,
      fill: "#C3EBFA",
    },
  ];
  return (
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
  );
}
