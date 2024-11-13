"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { PasswordInput } from "../password-input";
import Image from "next/image";

export default function StudentForm({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) {
  const formSchema = z.object({
    username: z
      .string()
      .min(3, {
        message: "Username must be at least 3 characters.",
      })
      .max(20, {
        message: "Username must be at most 20 characters.",
      }),
    firstName: z.string().min(3, {
      message: "First name must be at least 3 characters.",
    }),
    lastName: z.string().min(3, {
      message: "Last name must be at least 3 characters.",
    }),
    phone: z.string().min(3, {
      message: "Phone number must be at least 3 characters.",
    }),
    address: z.string().min(1, {
      message: "Address is required",
    }),
    birthday: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
    bloodType: z.string().min(1, {
      message: "Blood Type is required",
    }),
    sex: z.enum(["male", "female"], { message: "Sex is required" }),
    email: z.string().email({ message: "Invalid email address." }),
    img: z
      .instanceof(File, { message: "Please select an image file." })
      .refine((file) => file.size <= 10000000, `Max image size is 10MB.`)
      .refine(
        (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        "Only .jpg, .png, and .webp formats are supported."
      ),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: data?.username || "",
      email: data?.email || "",
      password: data?.password || "",
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      phone: data?.phone || "",
      address: data?.address || "",
      bloodType: data?.bloodType || "",
      birthday: data?.birthday
        ? new Date(data.birthday).toISOString().split("T")[0]
        : "",
      sex: data?.sex || "male",
      img: undefined,
    },
  });

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    console.log(value);
  };

  return (
    <>
      <DialogHeader className="pb-4">
        <DialogTitle>
          {type === "create"
            ? "Create a new parent"
            : "Update parent information"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <DialogDescription>Authentication Information</DialogDescription>

          <div className="flex flex-col gap-4 w-full md:flex-row md:justify-between">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full md:w-[31%]">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full md:w-[31%]">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full md:w-[31%]">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogDescription>Parent Information</DialogDescription>

          <div className="flex justify-between flex-wrap gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full md:w-[31%]">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full md:w-[31%]">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full md:w-[31%]">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-full md:w-[31%]">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bloodType"
              render={({ field }) => (
                <FormItem className="w-full md:w-[31%]">
                  <FormLabel>Blood Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem className="w-full md:w-[31%]">
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem className="w-full md:w-[31%]">
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select Student gender"
                          className="md:px-1"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">male</SelectItem>
                      <SelectItem value="female">female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="img"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center w-full md:w-[31%]">
                  <FormLabel
                    className="flex items-center gap-2 cursor-pointer"
                    htmlFor="img"
                  >
                    <Image src="/upload.png" alt="" width={28} height={28} />
                    <span>Upload a photo</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="img"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  {field.value && (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected file: {field.value.name}
                    </p>
                  )}
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
