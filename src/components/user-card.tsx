import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MoreHorizontal } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function UserCard({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const dataCount = await modelMap[type].count();

  return (
    <Card className="odd:bg-skyPurple even:bg-skyYellow rounded-2xl border-none flex-1 p-4 space-y-3 min-w-[130px]">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center justify-between">
          <div className="text-[11px] bg-white py-1 px-2 rounded-full">
            {new Date().getFullYear()}/{new Date().getDate()}
          </div>
          <MoreHorizontal className="size-4 text-white" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="font-semibold text-2xl">{dataCount}</p>
      </CardContent>
      <CardFooter className="capitalize text-sm p-0 text-gray-500 font-medium">
        {type}s
      </CardFooter>
    </Card>
  );
}
