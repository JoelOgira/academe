"use client";

import "react-calendar/dist/Calendar.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Announcements() {
  //   TEMPORARY DATA
  const events = [
    {
      id: 1,
      title: "Lorem ipsum dolor.",
      time: "8:00 AM - 5:00 PM",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    },
    {
      id: 2,
      title: "Lorem ipsum dolor.",
      time: "8:00 AM - 5:00 PM",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    },
    {
      id: 3,
      title: "Lorem ipsum dolor.",
      time: "8:00 AM - 5:00 PM",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    },
  ];

  return (
    <Card className="flex flex-col border-none rounded-xl p-0">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg md:text-xl">Announcements</span>
          <CardDescription className="text-gray-400 text-sm font-normal">
            View All
          </CardDescription>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full mx-auto h-fit p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {(events || []).map((event) => (
            <div
              className="flex flex-col gap-2 p-3 rounded-md odd:bg-skyBlue even:bg-skyPurple"
              key={event.id}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="font-semibold text-gray-600 text-sm">
                  {event.title}
                </h3>
                <span className="block text-xs text-gray-400 bg-white rounded p-1 ">
                  {event.time}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {event.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
