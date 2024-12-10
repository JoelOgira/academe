import Announcements from "@/components/announcements";
import FormContainer from "@/components/form-container";
import PerformanceChart from "@/components/performance-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import BigCalendarContainer from "@/components/big-calendar-container";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Teacher } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { MailIcon } from "lucide-react";

export default async function SingleTeacherPage({
  params,
}: {
  params: { id: string };
}) {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const { id } = params;

  const teacher:
    | (Teacher & {
        _count: { subjects: number; lessons: number; classes: number };
      })
    | null = await prisma.teacher.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true,
        },
      },
    },
  });

  if (!teacher) {
    return notFound();
  }

  return (
    <div className="size-full flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-4 xl:w-2/3">
        {/* Top */}
        <div className="flex flex-col gap-4 justify-between lg:flex-row">
          <Card className="border-none bg-skyYellow flex-1 p-4">
            <CardContent className="flex flex-row gap-4 p-0">
              <div className="flex justify-center w-1/3">
                <Image
                  src={teacher?.img || "/avatar-placeholder.png"}
                  alt="profile"
                  width={144}
                  height={144}
                  className="w-24 h-24 rounded-full italic object-cover md:w-36 md:h-36"
                />
              </div>
              <div className="h-full w-2/3 flex flex-col justify-between gap-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="capitalize">{`${teacher?.name} ${teacher?.surname}`}</CardTitle>

                  {role === "admin" && (
                    <FormContainer
                      table="teacher"
                      type="update"
                      data={teacher}
                    />
                  )}
                </div>
                <CardDescription>
                  {`A teacher at Academe school.`}
                </CardDescription>
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                  <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full 2xl:w-[44%]">
                    <Image src="/blood.png" alt="" width={14} height={14} />
                    <span className="text-muted-foreground">
                      {teacher?.bloodType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full 2xl:w-[44%]">
                    <Image src="/date.png" alt="" width={14} height={14} />
                    <span className="text-muted-foreground">
                      {formatDate(teacher?.birthday)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full 2xl:w-[44%]">
                    <MailIcon className="size-4" />
                    <span className="text-muted-foreground">
                      {teacher?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full 2xl:w-[44%]">
                    <Image src="/phone.png" alt="" width={14} height={14} />
                    <span className="text-muted-foreground">
                      {teacher?.phone}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="w-full p-4">
              <CardContent className="flex flex-row gap-4">
                <Image
                  src="/singleAttendance.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <CardHeader className="p-0 gap-2">
                  <CardTitle className="text-xl">90%</CardTitle>
                  <CardDescription>Attendance</CardDescription>
                </CardHeader>
              </CardContent>
            </Card>
            <Card className="w-full p-4">
              <CardContent className="flex flex-row gap-4">
                <Image
                  src="/singleBranch.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <CardHeader className="p-0 gap-2">
                  <CardTitle className="text-xl">2</CardTitle>
                  <CardDescription>Branches</CardDescription>
                </CardHeader>
              </CardContent>
            </Card>
            <Card className="w-full p-4">
              <CardContent className="flex flex-row gap-4">
                <Image
                  src="/singleLesson.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <CardHeader className="p-0 gap-2">
                  <CardTitle className="text-xl">
                    {teacher?._count.lessons}
                  </CardTitle>
                  <CardDescription>
                    {teacher?._count.lessons === 1 ? "Lesson" : "Lessons"}
                  </CardDescription>
                </CardHeader>
              </CardContent>
            </Card>
            <Card className="w-full p-4">
              <CardContent className="flex flex-row gap-4">
                <Image
                  src="/singleClass.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <CardHeader className="p-0 gap-2">
                  <CardTitle className="text-xl">
                    {teacher?._count.classes}
                  </CardTitle>
                  <CardDescription>
                    {teacher?._count.classes === 1 ? "Class" : "Classes"}
                  </CardDescription>
                </CardHeader>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-2 bg-white rounded-md p-4 h-[800px] shadow-sm">
          <h2 className="font-semibold leading-none tracking-tight text-lg md:text-xl">
            Teacher&apos;s Schedule
          </h2>
          <BigCalendarContainer type="teacherId" id={teacher?.id!} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full flex flex-col gap-4 xl:w-1/3">
        <div className="flex flex-col bg-white p-4 rounded-md shadow-sm gap-4">
          <h2 className="font-semibold leading-none tracking-tight text-lg md:text-xl">
            Shortcuts
          </h2>
          <div className="flex gap-4 flex-wrap text-xs text-muted-foreground">
            <Link
              href={`/list/classes?supervisorId=${teacher?.id}`}
              className="p-3 rounded-md bg-skyBlue"
            >
              Teacher&apos;s Classes
            </Link>
            <Link
              href={`/list/students?teacherId=${teacher?.id}`}
              className="p-3 rounded-md bg-lightSkyPurple"
            >
              Teacher&apos;s Students
            </Link>
            <Link
              href={`/list/lessons?teacherId=${teacher?.id}`}
              className="p-3 rounded-md bg-lightSkyYellow"
            >
              Teacher&apos;s Lessons
            </Link>
            <Link
              href={`/list/exams?teacherId=${teacher?.id}`}
              className="p-3 rounded-md bg-pink-50"
            >
              Teacher&apos;s Exams
            </Link>
            <Link
              href={`/list/assignments?teacherId=${teacher?.id}`}
              className="p-3 rounded-md bg-skyYellow"
            >
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
        <PerformanceChart />
        <Announcements />
      </div>
    </div>
  );
}
