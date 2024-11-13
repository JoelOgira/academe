"use client";

import { CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

export default function AttendanceCart({
  data,
}: {
  data: { name: string; present: number; absent: number }[];
}) {
  return (
    <CardContent className="w-full mx-auto h-[90%] pb-4 px-4">
      <ResponsiveContainer>
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            fontSize="14px"
          />
          <YAxis axisLine={false} tickLine={false} fontSize="14px" />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "20px" }}
          />
          <Bar
            dataKey="present"
            fill="#FAE27C"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill="#C3EBFA"
            radius={[10, 10, 0, 0]}
            legendType="circle"
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  );
}
