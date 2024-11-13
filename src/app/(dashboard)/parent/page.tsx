import Announcements from "@/components/announcements";
import BigCalendar from "@/components/big-calendar";
import EventCalendar from "@/components/event-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "parent",
};

export default function ParentPage() {
  return (
    <div className="flex size-full flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="size-full flex flex-col gap-8 xl:w-2/3">
        <Card className="size-full flex-1 flex flex-col border-none rounded-xl p-0">
          <CardHeader className="p-4 pb-0">
            <CardTitle>
              <span className="text-lg md:text-xl">Schedule (Jane Hoe) </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="size-full mx-auto p-4 flex flex-col gap-6">
            <BigCalendar />
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
