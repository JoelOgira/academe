import { MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import EventList from "./event-list";
import EventCalendar from "./event-calendar";

export default async function EventCalendarContainer({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) {
  const { date } = searchParams;

  return (
    <Card className="flex flex-col border-none rounded-xl p-0">
      <CardContent className="w-full mx-auto h-fit p-4 flex flex-col gap-6">
        <EventCalendar />

        <div className="flex flex-col gap-4">
          <CardTitle className="flex justify-between items-center">
            <span className="text-lg md:text-xl">Events</span>
            <CardDescription>
              <MoreHorizontal className="size-4" />
            </CardDescription>
          </CardTitle>
        </div>
        <EventList dateParam={date} />
      </CardContent>
    </Card>
  );
}
