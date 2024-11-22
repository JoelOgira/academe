"use client";

import React, { useState, useTransition } from "react";
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
import { Loader, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { deleteSubject } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FormContainerProps } from "./form-container";

const deleteActionMap = {
  subject: deleteSubject,
  // class: deleteClass,
  // teacher: deleteTeacher,
  // student: deleteStudent,
  // exam: deleteExam,
  // // TODO: OTHER DELETE ACTIONS
  // parent: deleteSubject,
  // lesson: deleteSubject,
  // assignment: deleteSubject,
  // result: deleteSubject,
  // attendance: deleteSubject,
  // event: deleteSubject,
  // announcement: deleteSubject,
};

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
  [key: string]: (
    type: "create" | "update",
    data?: any,
    handleClose?: () => void,
    relatedData?: any
  ) => JSX.Element;
} = {
  // teacher: (type, data, handleClose) => (
  //   <TeacherForm type={type} data={data} handleClose={handleClose} />
  // ),
  // student: (type, data, handleClose) => (
  //   <StudentForm type={type} data={data} handleClose={handleClose} />
  // ),
  // parent: (type, data, handleClose) => (
  //   <ParentForm type={type} data={data} handleClose={handleClose} />
  // ),
  subject: (type, data, handleClose, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      handleClose={handleClose}
      relatedData={relatedData}
    />
  ),
};

export default function FormModal({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const size = type === "create" ? "size-8" : "size-7";
  const bgColor =
    type === "create"
      ? "bg-skyYellow"
      : type === "update"
      ? "bg-skyBlue"
      : "bg-lightSkyPurple";

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id: string | number) => {
    setError(undefined);
    startTransition(async () => {
      if (table === "subject") {
        const { success, error } = await deleteSubject(id as number);

        if (!success) {
          setError(error);
          return;
        }

        handleClose();

        toast({
          title: "Success",
          description: "Subject deleted successfully",
          duration: 3000,
        });
      }

      router.refresh();
    });
  };

  const Form = () => {
    return type === "delete" && id ? (
      <>
        <DialogHeader>
          <DialogTitle>Delete {table}</DialogTitle>
          {error && (
            <DialogDescription className="text-red-500">
              {error}
            </DialogDescription>
          )}
          <DialogDescription className="py-3">
            Are you sure you want to delete this {table}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => handleDelete(id)}
            className="flex items-center gap-2"
            type="submit"
            variant="destructive"
          >
            {isPending && <Loader className="size-4 animate-spin" />}
            {isPending ? "Deleting" : "Delete"}
          </Button>
        </DialogFooter>
      </>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data, handleClose, relatedData)
    ) : (
      "Form not Found"
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
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
