"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const TeacherForm = dynamic(() => import("./forms/teacher-form"), {
  loading: () => <Loader2 className="size-6 animate-spin mx-auto" />,
});

const StudentForm = dynamic(() => import("./forms/student-form"), {
  loading: () => <Loader2 className="size-6 animate-spin mx-auto" />,
});

const ParentForm = dynamic(() => import("./forms/parent-form"), {
  loading: () => <Loader2 className="size-6 animate-spin mx-auto" />,
});

const SubjectForm = dynamic(() => import("./forms/subject-form"), {
  loading: () => <Loader2 className="size-6 animate-spin mx-auto" />,
});

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
  parent: (type, data) => <ParentForm type={type} data={data} />,
  subject: (type, data) => <SubjectForm type={type} data={data} />,
};

export default function FormModal({
  table,
  type,
  data,
  id,
}: {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcements";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
}) {
  const size = type === "create" ? "size-8" : "size-7";
  const bgColor =
    type === "create"
      ? "bg-skyYellow"
      : type === "update"
      ? "bg-skyBlue"
      : "bg-lightSkyPurple";

  const Form = () => {
    return type === "delete" && id ? (
      <>
        <DialogHeader>
          <DialogTitle>Delete {table}</DialogTitle>
          <DialogDescription>
            All Data will be lost. Are you sure you want to delete this {table}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      </>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data)
    ) : (
      "Form not Found"
    );
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button
            className={cn(
              "flex items-center justify-center rounded-full",
              size,
              bgColor
            )}
          >
            <Image src={`/${type}.png`} alt="" width={16} height={16} />
          </button>
        </DialogTrigger>
        <DialogContent>
          <ScrollArea className="h-[80svh] md:h-full">
            <Form />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
