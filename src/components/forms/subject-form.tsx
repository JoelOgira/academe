"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SubjectSchema, subjectSchema } from "@/lib/form-validation-schema";
import { createSubject, updateSubject } from "@/lib/actions";
import { Loader, Check, ChevronsUpDown, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ITEM_PER_PAGE } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [openTeacherSelect, setOpenTeacherSelect] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: data?.name || "",
      teachers: data?.teachers || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teachers",
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
          <div className="flex justify-between flex-wrap gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full md:w-[48%]">
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
              render={() => (
                <FormItem className="w-full md:w-[48%]">
                  <FormLabel>Teachers</FormLabel>
                  <Popover
                    open={openTeacherSelect}
                    onOpenChange={setOpenTeacherSelect}
                    modal={true}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !fields.length && "text-muted-foreground"
                          )}
                        >
                          <span className="flex-grow text-left truncate">
                            {fields.length > 0
                              ? fields.map((field) => field.name).join(", ")
                              : "Select teachers"}
                          </span>
                          <div className="flex items-center">
                            {type === "update" && fields.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mr-2 h-8 px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  form.setValue("teachers", []);
                                }}
                              >
                                <X className="size-4" />
                              </Button>
                            )}
                            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                          </div>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search teachers..." />
                        <CommandList>
                          <ScrollArea className="h-[300px]">
                            <CommandEmpty>No teachers found.</CommandEmpty>
                            <CommandGroup>
                              {relatedData?.teachers?.map((teacher) => {
                                const isSelected = fields.some(
                                  (field) => field.id === teacher.id
                                );
                                return (
                                  <CommandItem
                                    key={teacher.id}
                                    value={`${teacher.name} ${teacher.surname}`}
                                    onSelect={() => {
                                      if (isSelected) {
                                        const indexToRemove = fields.findIndex(
                                          (field) => field.id === teacher.id
                                        );
                                        if (indexToRemove !== -1) {
                                          remove(indexToRemove);
                                        }
                                      } else {
                                        append({
                                          id: teacher.id,
                                          name: `${teacher.name} ${teacher.surname}`,
                                        });
                                      }
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        isSelected ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {teacher.name} {teacher.surname}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </ScrollArea>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
