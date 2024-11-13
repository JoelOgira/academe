import prisma from "@/lib/prisma";
import React from "react";
import BigCalendar from "./big-calendar";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

export default async function BigCalendarContainer({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) {
  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as unknown as number }),
    },
  });

  const data = dataRes.map((lesson) => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);

  return <BigCalendar calendarEvents={schedule} />;
}
