"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SubjectSchema, subjectSchema } from "@/lib/form-validation-schema";
import { createSubject, updateSubject } from "@/lib/actions";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ITEM_PER_PAGE } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { MultiSelect } from "../ui/multi-select";

interface SubjectFormProps {
  type: "create" | "update";
  data?: any;
  handleClose?: () => void;
  relatedData?: {
    teachers: { id: string; name: string; surname: string }[];
  };
}

export default function SubjectForm({
  type,
  data,
  handleClose,
  relatedData,
}: SubjectFormProps) {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: data?.name || "",
      teachers: data?.teachers?.map((teacher: any) => teacher.id) || [],
    },
  });

  const navigateToNewSubject = async (
    subjectId: number,
    subjectName: string
  ) => {
    try {
      let subjects: { id: number; name: string }[] = [];

      try {
        const response = await fetch("/api/subjects/names");
        if (response.ok) {
          subjects = await response.json();
        }
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
      }

      const sortedSubjects = [
        ...subjects,
        { id: subjectId, name: subjectName },
      ].sort((a, b) => a.name.localeCompare(b.name));

      const position = sortedSubjects.findIndex((s) => s.id === subjectId);
      const targetPage = Math.floor(position / ITEM_PER_PAGE) + 1;

      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set("page", targetPage.toString());
      currentParams.set("highlight", subjectId.toString());

      router.push(`/list/subjects?${currentParams.toString()}`);
    } catch (error) {
      console.error("Navigation error:", error);
      router.push("/list/subjects?page=1");
    } finally {
      router.refresh();
    }
  };

  const onSubmit = (formData: SubjectSchema) => {
    setError(undefined);
    startTransition(async () => {
      let response:
        | {
            success: boolean;
            error?: string;
            subjectId?: number;
          }
        | undefined;

      if (type === "create") {
        response = await createSubject(formData);
      }
      if (type === "update") {
        response = await updateSubject(data?.id, formData);
      }

      if (!response) {
        setError("An unexpected error occurred");
        return;
      }

      const { success, error, subjectId } = response;

      if (!success) {
        setError(error);
        return;
      }

      toast({
        title: "Success",
        description: `Subject ${
          type === "create" ? "created" : "updated"
        } successfully`,
        variant: "default",
        duration: 3000,
      });

      if (handleClose) {
        handleClose();
      }

      if (type === "update") {
        router.refresh();
      }

      if (type === "create" && subjectId) {
        await navigateToNewSubject(subjectId, formData.name);
      }
    });
  };

  return (
    <>
      <DialogHeader className="pb-4 px-1">
        <DialogTitle>
          {type === "create"
            ? "Create a new subject"
            : "Update subject information"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-1"
        >
          {error && (
            <p className="text-center text-destructive text-sm">{error}</p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter subject name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teachers"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Teachers</FormLabel>
                  <MultiSelect
                    modalPopover={true}
                    asChild={true}
                    options={
                      relatedData?.teachers.map((teacher) => ({
                        label: `${teacher.name} ${teacher.surname}`,
                        value: teacher.id,
                      })) || []
                    }
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                    placeholder="Select teachers"
                    variant="default"
                    animation={2}
                    maxCount={3}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            className="flex items-center gap-2 capitalize"
            type="submit"
            variant="secondary"
            disabled={isPending}
          >
            {isPending && <Loader className="size-4 animate-spin" />}
            {type === "create" && isPending
              ? "Creating"
              : type === "update" && isPending
              ? "Updating"
              : type === "create"
              ? "Create"
              : "Update"}
          </Button>
        </form>
      </Form>
    </>
  );
}
