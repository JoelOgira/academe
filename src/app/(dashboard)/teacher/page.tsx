import Announcements from "@/components/announcements";
import EventCalendar from "@/components/event-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import BigCalendarContainer from "@/components/big-calendar-container";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "teacher",
};

export default function TeacherPage() {
  const { userId } = auth();

  const teacherId = userId;

  return (
    <div className="flex flex-1 flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="size-full flex flex-col gap-8 xl:w-2/3">
        <Card className="size-full flex-1 flex flex-col border-none rounded-xl p-0">
          <CardHeader className="p-4 pb-0">
            <CardTitle>
              <span className="text-lg md:text-xl">Schedule (4A) </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="size-full mx-auto p-4 flex flex-col gap-6">
            <BigCalendarContainer type="teacherId" id={teacherId!} />
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
