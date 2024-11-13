import { MoreHorizontal } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import AttendanceCart from "./attendance-chart";
import prisma from "@/lib/prisma";

export default async function AttendanceChartContainer() {
  const today = new Date();

  const dayOfWeek = today.getDay();

  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);

  lastMonday.setDate(today.getDate() - daysSinceMonday);

  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const attendanceMap: { [key: string]: { present: number; absent: number } } =
    {
      Mon: { present: 0, absent: 0 },
      Tue: { present: 0, absent: 0 },
      Wed: { present: 0, absent: 0 },
      Thu: { present: 0, absent: 0 },
      Fri: { present: 0, absent: 0 },
    };

  resData.forEach((item) => {
    const itemDate = new Date(item.date);
    const dayOfWeek = itemDate.getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dayName = daysOfWeek[dayOfWeek - 1];

      if (item.present) {
        attendanceMap[dayName].present += 1;
      } else {
        attendanceMap[dayName].absent += 1;
      }
    }
  });

  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

  return (
    <Card className="flex flex-col border-none size-full rounded-xl">
      <CardHeader className="pb-0 px-4 pt-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">Attendance</span>
          <MoreHorizontal className="size-4" />
        </CardTitle>
      </CardHeader>
      <AttendanceCart data={data} />
    </Card>
  );
}
