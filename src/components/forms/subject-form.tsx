"use client";

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

export default function SubjectForm({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) {
  const form = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: data?.name || "",
    },
  });

  const onSubmit = (value: SubjectSchema) => {
    console.log(value);
  };

  return (
    <>
      <DialogHeader className="pb-4">
        <DialogTitle>
          {type === "create"
            ? "Create a new subject"
            : "Update subject information"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex justify-between flex-wrap gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full md:w-[31%]">
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" variant="secondary">
            {type === "create" ? "Create" : "Update"}
          </Button>
        </form>
      </Form>
    </>
  );
}
