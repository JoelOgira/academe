"use client";

import { useState, useEffect } from "react";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { calendarEvents } from "@/lib/data";
import { useMedia } from "react-use";

const localizer = momentLocalizer(moment);

export default function BigCalendar() {
  const isMobile = useMedia("(max-width: 480px)");
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  useEffect(() => {
    if (isMobile) {
      setView(Views.DAY);
      setView(Views.WORK_WEEK);
    }
  }, [isMobile]);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView); // Allow toggling between views
  };

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]} // Allow both views for all screen sizes
      view={view}
      onView={handleOnChangeView}
      min={new Date(2024, 1, 0, 8, 0, 0)}
      max={new Date(2024, 1, 0, 17, 0, 0)}
      style={{ height: "100%" }}
    />
  );
}
