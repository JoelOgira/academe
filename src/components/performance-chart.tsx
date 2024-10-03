"use client";

import { MoreHorizontal } from "lucide-react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";

const data = [
  { name: "Group A", value: 92, fill: "#C3EBFA" },
  { name: "Group B", value: 8, fill: "#FAE27C" },
];

export default function PerformanceChart() {
  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-md shadow-sm h-80 relative">
      <div className="flex justify-between items-center space-x-4">
        <h2 className="font-semibold leading-none tracking-tight text-lg md:text-xl">
          Performance
        </h2>
        <MoreHorizontal className="size-5 text-muted-foreground" />
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h2 className="text-3xl font-bold">9.2</h2>
        <p className="text-gray-400 text-xs">of 10 max Score</p>
      </div>
      <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">
        1st Semester - 2nd Semester
      </h2>
    </div>
  );
}
