import Announcements from "@/components/announcements";
import AttendanceCart from "@/components/attendance-chart";
import CountCart from "@/components/count-chart";
import EventCalendar from "@/components/event-calendar";
import FinanceCart from "@/components/finance-chart";
import UserCard from "@/components/user-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "admin",
};

export default function AdminPage() {
  return (
    <div className="w-full h-fit flex flex-col gap-4 md:flex-row">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-8 lg:w-2/3">
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="student" />
          <UserCard type="parent" />
        </div>

        {/* MIDDLE CHART */}
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="lg:w-1/3 h-[450px]">
            <CountCart />
          </div>
          <div className="lg:w-2/3 h-[450px]">
            <AttendanceCart />
          </div>
        </div>

        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceCart />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
}
