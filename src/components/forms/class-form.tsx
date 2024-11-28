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
import { ClassSchema, classSchema } from "@/lib/form-validation-schema";
import { createClass, updateClass } from "@/lib/actions";
import { Loader, Check, ChevronsUpDown, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClassFormProps {
  type: "create" | "update";
  data?: any;
  handleClose?: () => void;
  relatedData?: {
    grades: { id: number; level: number }[];
    teachers: { id: string; name: string; surname: string }[];
  };
}

export default function ClassForm({
  type,
  data,
  handleClose,
  relatedData,
}: ClassFormProps) {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const [openGradeSelect, setOpenGradeSelect] = useState(false);
  const [openSupervisorSelect, setOpenSupervisorSelect] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: data?.name || "",
      capacity: data?.capacity || undefined,
      gradeId: data?.gradeId || undefined,
      supervisorId: data?.supervisorId || undefined,
    },
  });

  const onSubmit = (formData: ClassSchema) => {
    setError(undefined);
    startTransition(async () => {
      let response: { success: boolean; error?: string } | undefined;

      if (type === "create") {
        response = await createClass(formData);
      }
      if (type === "update" && data?.id) {
        response = await updateClass(data.id, formData);
      }

      if (!response) {
        setError("An unexpected error occurred");
        return;
      }

      const { success, error } = response;

      if (!success) {
        setError(error);
        return;
      }

      toast({
        title: "Success",
        description: `Class ${
          type === "create" ? "created" : "updated"
        } successfully`,
        variant: "default",
        duration: 3000,
      });

      if (handleClose) {
        handleClose();
      }

      router.refresh();
    });
  };

  return (
    <>
      <DialogHeader className="pb-4 px-1">
        <DialogTitle>
          {type === "create"
            ? "Create a new class"
            : "Update class information"}
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
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter class name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem className="w-full md:w-[48%]">
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter class capacity"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gradeId"
              render={({ field }) => (
                <FormItem className="w-full md:w-[48%]">
                  <FormLabel>Grade</FormLabel>
                  <Popover
                    open={openGradeSelect}
                    onOpenChange={setOpenGradeSelect}
                    modal={true}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? relatedData?.grades.find(
                                (grade) => grade.id === field.value
                              )?.level
                            : "Select grade"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search grades..." />
                        <CommandList>
                          <ScrollArea className="h-[200px]">
                            <CommandEmpty>No grade found.</CommandEmpty>
                            <CommandGroup>
                              {relatedData?.grades.map((grade) => (
                                <CommandItem
                                  key={grade.id}
                                  value={grade.level.toString()}
                                  onSelect={() => {
                                    form.setValue("gradeId", grade.id);
                                    setOpenGradeSelect(false);
                                  }}
                                  className="flex items-center justify-between"
                                >
                                  Grade {grade.level}
                                  <Check
                                    className={cn(
                                      "ml-2 h-4 w-4",
                                      grade.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
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

            <FormField
              control={form.control}
              name="supervisorId"
              render={({ field }) => (
                <FormItem className="w-full md:w-[48%]">
                  <FormLabel>Supervisor</FormLabel>
                  <Popover
                    open={openSupervisorSelect}
                    onOpenChange={setOpenSupervisorSelect}
                    modal={true}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? relatedData?.teachers.find(
                                (teacher) => teacher.id === field.value
                              )?.name
                            : "Select supervisor"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search teachers..." />
                        <CommandList>
                          <ScrollArea className="h-[200px]">
                            {!relatedData?.teachers ? (
                              <div className="flex justify-center items-center p-4">
                                <Loader2 className="animate-spin size-4" />
                              </div>
                            ) : (
                              <>
                                <CommandEmpty>No teacher found.</CommandEmpty>
                                <CommandGroup>
                                  {relatedData?.teachers.map((teacher) => (
                                    <CommandItem
                                      key={teacher.id}
                                      value={`${teacher.name} ${teacher.surname}`}
                                      onSelect={() => {
                                        form.setValue(
                                          "supervisorId",
                                          teacher.id
                                        );
                                        setOpenSupervisorSelect(false);
                                      }}
                                      className="flex items-center justify-between"
                                    >
                                      {teacher.name} {teacher.surname}
                                      <Check
                                        className={cn(
                                          "ml-2 h-4 w-4",
                                          teacher.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </>
                            )}
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
