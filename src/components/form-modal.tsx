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
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Loader, Trash2Icon } from "lucide-react";
import dynamic from "next/dynamic";
import { deleteClass, deleteSubject } from "@/lib/actions";
import { deleteTeacher } from "./forms/teacher/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FormContainerProps } from "./form-container";

const ClassForm = dynamic(() => import("./forms/class-form"), {
  loading: () => <Loader className="size-6 animate-spin mx-auto" />,
});

const TeacherForm = dynamic(() => import("./forms/teacher/teacher-form"), {
  loading: () => <Loader className="size-6 animate-spin mx-auto" />,
});

const SubjectForm = dynamic(() => import("./forms/subject-form"), {
  loading: () => <Loader className="size-6 animate-spin mx-auto" />,
});

const forms: {
  [key: string]: (
    type: "create" | "update",
    data?: any,
    handleClose?: () => void,
    relatedData?: any
  ) => JSX.Element;
} = {
  teacher: (type, data, handleClose, relatedData) => (
    <TeacherForm
      type={type}
      data={data}
      handleClose={handleClose}
      relatedData={relatedData}
    />
  ),
  class: (type, data, handleClose, relatedData) => (
    <ClassForm
      type={type}
      data={data}
      handleClose={handleClose}
      relatedData={relatedData}
    />
  ),
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

      if (table === "class") {
        const { success, error } = await deleteClass(id as number);

        if (!success) {
          setError(error);
          return;
        }

        handleClose();

        toast({
          title: "Success",
          description: "Class deleted successfully",
          duration: 3000,
        });
      }

      if (table === "teacher") {
        const { success, error } = await deleteTeacher(id as string);

        if (!success) {
          setError(error);
          return;
        }

        handleClose();

        toast({
          title: "Success",
          description: "Teacher deleted successfully",
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
            Are you sure you want to delete this {table}? <br />
            This action cannot be undone
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center gap-2">
          <Button onClick={handleClose} variant="outline">
            Cancel
          </Button>

          <Button
            onClick={() => handleDelete(id)}
            className="flex items-center gap-2"
            type="submit"
            variant="destructive"
          >
            {isPending && <Loader className="size-4 animate-spin" />}
            {isPending ? "Deleting" : "Delete"}
            {!isPending && <Trash2Icon className="size-4" />}
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
      <DialogContent className="max-h-[90svh] overflow-hidden">
        <ScrollArea className="pr-2 max-h-[calc(90svh-4rem)]">
          <Form />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
