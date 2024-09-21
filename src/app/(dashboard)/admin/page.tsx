import UserCard from "@/components/user-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "admin",
};

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3">
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Students" />
          <UserCard type="Teachers" />
          <UserCard type="Parents" />
          <UserCard type="Staffs" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3"></div>
    </div>
  );
}
