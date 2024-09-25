"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function EventCalendar() {
  const [value, onChange] = useState<Value>(new Date());

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
      <CardContent className="w-full mx-auto h-fit p-4 flex flex-col gap-6">
        <Calendar value={value} onChange={onChange} />
        <div className="flex flex-col gap-4">
          <CardTitle className="flex justify-between items-center">
            <span className="text-lg">Events</span>
            <CardDescription>
              <MoreHorizontal className="size-4" />
            </CardDescription>
          </CardTitle>
          {(events || []).map((event) => (
            <div
              className="flex flex-col gap-2 p-3 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-skyBlue even:border-t-skyPurple"
              key={event.id}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="font-semibold text-gray-600 text-sm">
                  {event.title}
                </h3>
                <span className="block text-xs text-gray-400">
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
