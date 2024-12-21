import Announcements from "@/components/announcements";
import BigCalendarContainer from "@/components/big-calendar-container";
import EventCalendar from "@/components/event-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "student",
};

export default async function StudentPage() {
  const { userId } = auth();

  const studentId = userId;

  const student = await prisma.student.findUnique({
    where: {
      id: studentId!,
    },
    select: {
      classId: true,
    },
  });

  const classId = student?.classId;

  return (
    <div className="flex size-full flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="size-full flex flex-col gap-8 xl:w-2/3">
        <Card className="size-full flex-1 flex flex-col border-none rounded-xl p-0">
          <CardHeader className="p-4 pb-0">
            <CardTitle>
              <span className="text-lg md:text-xl">Schedule (4A) </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="size-full mx-auto p-4 flex flex-col gap-6">
            <BigCalendarContainer type="classId" id={classId!} />
          </CardContent>
        </Card>
      </div>

      {/* RIGHT */}
      <div className="w-full flex flex-col gap-8 xl:w-1/3">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
}
