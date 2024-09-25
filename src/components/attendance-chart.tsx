"use client";

import { MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const data = [
  {
    name: "Mon",
    present: 80,
    absent: 30,
  },
  {
    name: "Tue",
    present: 50,
    absent: 30,
  },
  {
    name: "Wed",
    present: 50,
    absent: 30,
  },
  {
    name: "Thu",
    present: 50,
    absent: 30,
  },
  {
    name: "Fri",
    present: 50,
    absent: 30,
  },
];

export default function AttendanceCart() {
  return (
    <Card className="flex flex-col border-none size-full rounded-xl">
      <CardHeader className="pb-0 px-4 pt-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">Attendance</span>
          <MoreHorizontal className="size-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full mx-auto h-[90%] pb-4 px-4">
        <ResponsiveContainer>
          <BarChart width={500} height={300} data={data} barSize={20}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ddd"
            />
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
    </Card>
  );
}
