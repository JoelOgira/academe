import "react-calendar/dist/Calendar.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { role, currentUserId } from "@/lib/settings";
import { formatDate } from "@/lib/utils";

export default async function Announcements() {
  // Role conditions
  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  const data = await prisma.announcement.findMany({
    where: {
      ...(role !== "admin" && {
        OR: [
          { classId: null },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ],
      }),
    },
    take: 3,
    orderBy: {
      date: "desc",
    },
  });

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
          {(data || []).map((announcement) => (
            <div
              className="flex flex-col gap-2 p-3 rounded-md odd:bg-skyBlue even:bg-skyPurple"
              key={announcement.id}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="font-semibold text-gray-600 text-sm">
                  {announcement.title}
                </h3>
                <span className="block text-xs text-gray-400 bg-white rounded p-1 ">
                  {formatDate(announcement.date)}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {announcement.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
