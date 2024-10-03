import Announcements from "@/components/announcements";
import BigCalendar from "@/components/big-calendar";
import PerformanceChart from "@/components/performance-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function SingleTeacherPage() {
  return (
    <div className="size-full flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-4 xl:w-2/3">
        {/* Top */}
        <div className="flex flex-col gap-4 justify-between lg:flex-row">
          <Card className="border-none bg-skyBlue flex-1 p-4">
            <CardContent className="flex flex-row gap-4 p-0">
              <div className="flex justify-center w-1/3">
                <Image
                  src="https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt=""
                  width={144}
                  height={144}
                  className="w-36 h-36 rounded-full object-cover"
                />
              </div>
              <div className="h-full w-2/3 flex flex-col justify-between gap-4">
                <CardTitle>Wojack Murphy</CardTitle>
                <CardDescription>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </CardDescription>
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                  <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full 2xl:w-[40%]">
                    <Image src="/blood.png" alt="" width={14} height={14} />
                    <span className="text-muted-foreground">A+</span>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full 2xl:w-[40%]">
                    <Image src="/date.png" alt="" width={14} height={14} />
                    <span className="text-muted-foreground">
                      September 2001
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full 2xl:w-[40%]">
                    <Image src="/mail.png" alt="" width={14} height={14} />
                    <span className="text-muted-foreground">
                      teacher@email.com
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full 2xl:w-[40%]">
                    <Image src="/phone.png" alt="" width={14} height={14} />
                    <span className="text-muted-foreground">
                      +254-7123-4234
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-1 gap-4 justify-between flex-wrap">
            <Card className="w-full p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
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
            <Card className="w-full p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
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
            <Card className="w-full p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <CardContent className="flex flex-row gap-4">
                <Image
                  src="/singleLesson.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <CardHeader className="p-0 gap-2">
                  <CardTitle className="text-xl">6</CardTitle>
                  <CardDescription>Lessons</CardDescription>
                </CardHeader>
              </CardContent>
            </Card>
            <Card className="w-full p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <CardContent className="flex flex-row gap-4">
                <Image
                  src="/singleClass.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <CardHeader className="p-0 gap-2">
                  <CardTitle className="text-xl">8</CardTitle>
                  <CardDescription>Classes</CardDescription>
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
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full flex flex-col gap-4 xl:w-1/3">
        <div className="flex flex-col bg-white p-4 rounded-md shadow-sm gap-4">
          <h2 className="font-semibold leading-none tracking-tight text-lg md:text-xl">
            Shortcuts
          </h2>
          <div className="flex gap-4 flex-wrap text-xs text-muted-foreground">
            <Link href="/" className="p-3 rounded-md bg-skyBlue">
              Teacher&apos;s Classes
            </Link>
            <Link href="/" className="p-3 rounded-md bg-lightSkyPurple">
              Teacher&apos;s Students
            </Link>
            <Link href="/" className="p-3 rounded-md bg-lightSkyYellow">
              Teacher&apos;s Lessons
            </Link>
            <Link href="/" className="p-3 rounded-md bg-pink-50">
              Teacher&apos;s Exams
            </Link>
            <Link href="/" className="p-3 rounded-md bg-skyYellow">
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
