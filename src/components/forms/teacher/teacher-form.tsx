"use client";

import { useTransition, useState } from "react";
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
import { PasswordInput } from "../../password-input";
import { teacherSchema, TeacherSchema } from "@/lib/form-validation-schema";
import { Loader, Upload } from "lucide-react";
import { ITEM_PER_PAGE } from "@/lib/utils";
import { MultiSelect } from "@/components/ui/multi-select";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createTeacher, updateTeacher } from "./actions";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import FileUpload from "../../file-upload";
import { DateTimePicker } from "@/components/ui/datetime-picker";

interface TeacherFormProps {
  type: "create" | "update";
  data?: any;
  handleClose?: () => void;
  relatedData?: {
    subjects: { id: number; name: string }[];
  };
}

export default function TeacherForm({
  type,
  data,
  handleClose,
  relatedData,
}: TeacherFormProps) {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [img, setImg] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [profileUploaded, setProfileUploaded] = useState(false);

  const form = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      id: data?.id || "",
      username: data?.username || "",
      email: data?.email || "",
      password: data?.password ? "Update password" : "",
      name: data?.name || "",
      surname: data?.surname || "",
      phone: data?.phone || "",
      address: data?.address || "",
      bloodType: data?.bloodType || "",
      birthday: data?.birthday
        ? new Date(data.birthday).toISOString().split("T")[0]
        : "",
      sex: data?.sex || "MALE",
      img: data?.img || "",
      subjects:
        data?.subjects?.map((subject: any) => subject.id.toString()) || [],
    },
  });

  const navigateToNewTeacher = async (
    teacherId: string,
    teacherName: string
  ) => {
    try {
      let teachers: { id: string; name: string }[] = [];

      const response = await fetch("/api/teachers/names");
      if (response.ok) {
        teachers = await response.json();
      }

      const sortedTeachers = [
        ...teachers,
        { id: teacherId, name: teacherName },
      ].sort((a, b) => a.name.localeCompare(b.name));

      const position = sortedTeachers.findIndex((s) => s.id === teacherId);
      const targetPage = Math.floor(position / ITEM_PER_PAGE) + 1;

      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set("page", targetPage.toString());
      currentParams.set("highlight", teacherId);

      router.push(`/list/teachers?${currentParams.toString()}`);
    } catch (error) {
      console.error("Navigation error:", error);
      router.push("/list/teachers?page=1");
    } finally {
      router.refresh();
    }
  };

  const onSubmit = (formData: TeacherSchema) => {
    setError(undefined);
    startTransition(async () => {
      const action = type === "create" ? createTeacher : updateTeacher;
      const response = await action(
        type === "update" ? { ...formData, id: data.id } : formData
      );

      if (!response.success) {
        setError(response.error);
        return;
      }

      toast({
        title: "Success",
        description: `Teacher ${
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

      if (type === "create" && response.teacherId) {
        await navigateToNewTeacher(response.teacherId, formData.name);
      }
    });
  };

  return (
    <>
      <DialogHeader className="pb-4">
        <DialogTitle>
          {type === "create"
            ? "Create a new teacher"
            : "Update teacher information"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <DialogDescription>Authentication Information</DialogDescription>
          {error && (
            <p className="text-center text-destructive text-sm">{error}</p>
          )}
          <div className="grid grid-cols-1 gap-4 p-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
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
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full md:col-span-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogDescription>Teacher Information</DialogDescription>

          <div className="grid grid-cols-1 gap-4 p-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
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
              name="surname"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Surname</FormLabel>
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
                <FormItem className="w-full">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-full">
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
                <FormItem className="w-full">
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
                <FormItem className="w-full">
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={date}
                      onChange={(newDate) => {
                        field.onChange(newDate?.toISOString().split("T")[0]);
                        setDate(newDate);
                      }}
                      hideTime={true}
                      modal={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:border-none">
                        <SelectValue
                          placeholder="Select teacher gender"
                          className="md:px-1"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Subjects</FormLabel>
                  <MultiSelect
                    modalPopover={true}
                    asChild={true}
                    options={
                      relatedData?.subjects.map((subject) => ({
                        label: subject.name,
                        value: subject.id.toString(),
                      })) || []
                    }
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                    placeholder="Select subjects"
                    variant="default"
                    animation={2}
                    maxCount={3}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="img"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Profile Photo</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger className="w-full">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex items-center gap-2 w-full"
                        >
                          {!profileUploaded && <Upload className="size-4" />}
                          <span>
                            {profileUploaded
                              ? `Profile Photo Uploaded`
                              : field.value
                              ? "Update Image"
                              : "Upload Image"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <FileUpload
                          endpoint="teacherImage"
                          onChange={(url) => {
                            if (url) {
                              field.onChange(url);
                              setImg(url);
                              setProfileUploaded(true);
                              setOpen(false);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
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

// "use client";

// import { useTransition, useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import React from "react";
// import { PasswordInput } from "../../password-input";
// import Image from "next/image";
// import { teacherSchema, TeacherSchema } from "@/lib/form-validation-schema";
// import { Loader, Upload } from "lucide-react";
// import { ITEM_PER_PAGE } from "@/lib/utils";
// import { MultiSelect } from "@/components/ui/multi-select";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useToast } from "@/hooks/use-toast";
// import { createTeacher, updateTeacher } from "./actions";
// import { CldUploadWidget } from "next-cloudinary";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import FileUpload from "../../file-upload";

// interface TeacherFormProps {
//   type: "create" | "update";
//   data?: any;
//   handleClose?: () => void;
//   relatedData?: {
//     subjects: { id: string; name: string }[];
//   };
// }

// export default function TeacherForm({
//   type,
//   data,
//   handleClose,
//   relatedData,
// }: TeacherFormProps) {
//   const [error, setError] = useState<string>();
//   const [isPending, startTransition] = useTransition();
//   const { toast } = useToast();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [img, setImg] = useState<any>();

//   const form = useForm<TeacherSchema>({
//     resolver: zodResolver(teacherSchema),
//     defaultValues: {
//       username: data?.username || "",
//       email: data?.email || "",
//       password: data?.password ? "Update password" : "",
//       name: data?.name || "",
//       surname: data?.surname || "",
//       phone: data?.phone || "",
//       address: data?.address || "",
//       bloodType: data?.bloodType || "",
//       birthday: data?.birthday
//         ? new Date(data.birthday).toISOString().split("T")[0]
//         : "",
//       sex: data?.sex || "MALE",
//       img: data?.img || "",
//       subjects:
//         data?.subjects?.map((subject: any) => subject.id.toString()) || [],
//     },
//   });

//   const navigateToNewTeacher = async (
//     teacherId: string,
//     teacherName: string
//   ) => {
//     try {
//       let teachers: { id: string; name: string }[] = [];

//       try {
//         const response = await fetch("/api/teachers/names");
//         if (response.ok) {
//           teachers = await response.json();
//         }
//       } catch (fetchError) {
//         console.error("Fetch error:", fetchError);
//       }

//       const sortedTeaches = [
//         ...teachers,
//         { id: teacherId, name: teacherName },
//       ].sort((a, b) => a.name.localeCompare(b.name));

//       const position = sortedTeaches.findIndex((s) => s.id === teacherId);
//       const targetPage = Math.floor(position / ITEM_PER_PAGE) + 1;

//       const currentParams = new URLSearchParams(searchParams.toString());
//       currentParams.set("page", targetPage.toString());
//       currentParams.set("highlight", teacherId);

//       router.push(`/list/teachers?${currentParams.toString()}`);
//     } catch (error) {
//       console.error("Navigation error:", error);
//       router.push("/list/teachers?page=1");
//     } finally {
//       router.refresh();
//     }
//   };

//   const onSubmit = (data: TeacherSchema) => {
//     setError(undefined);
//     startTransition(async () => {
//       let response:
//         | {
//             success: boolean;
//             error?: string;
//             teacherId?: string;
//           }
//         | undefined;

//       if (type === "create") {
//         response = await createTeacher(data);
//       }
//       if (type === "update") {
//         response = await updateTeacher(data?.id!, data);
//       }

//       if (!response) {
//         setError("An unexpected error occurred");
//         return;
//       }

//       const { success, error, teacherId } = response;

//       if (!success) {
//         setError(error);
//         return;
//       }

//       toast({
//         title: "Success",
//         description: `Teacher ${
//           type === "create" ? "created" : "updated"
//         } successfully`,
//         variant: "default",
//         duration: 3000,
//       });

//       if (handleClose) {
//         handleClose();
//       }

//       if (type === "update") {
//         router.refresh();
//       }

//       if (type === "create" && teacherId) {
//         await navigateToNewTeacher(teacherId, data.name);
//       }
//     });
//   };

//   return (
//     <>
//       <DialogHeader className="pb-4">
//         <DialogTitle>
//           {type === "create"
//             ? "Create a new teacher"
//             : "Update teacher information"}
//         </DialogTitle>
//       </DialogHeader>
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="flex flex-col gap-6"
//         >
//           <DialogDescription>Authentication Information</DialogDescription>
//           {error && (
//             <p className="text-center text-destructive text-sm">{error}</p>
//           )}
//           <div className="grid grid-cols-1 gap-4 p-1 md:grid-cols-2">
//             <FormField
//               control={form.control}
//               name="username"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Username</FormLabel>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <PasswordInput {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <DialogDescription>Teacher Information</DialogDescription>

//           <div className="grid grid-cols-1 gap-4 p-1 md:grid-cols-2">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>First Name</FormLabel>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="surname"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Surname</FormLabel>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="phone"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Phone</FormLabel>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="address"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Address</FormLabel>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="bloodType"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Blood Type</FormLabel>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="birthday"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Date of Birth</FormLabel>
//                   <FormControl>
//                     <Input {...field} type="date" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="sex"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Gender</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger className="focus:border-none">
//                         <SelectValue
//                           placeholder="Select teacher gender"
//                           className="md:px-1"
//                         />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="MALE">Male</SelectItem>
//                       <SelectItem value="FEMALE">Female</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="subjects"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Subjects</FormLabel>
//                   <MultiSelect
//                     modalPopover={true}
//                     asChild={true}
//                     options={
//                       relatedData?.subjects.map((subject) => ({
//                         label: subject.name,
//                         value: subject.id.toString(),
//                       })) || []
//                     }
//                     onValueChange={(value) => field.onChange(value)}
//                     defaultValue={field.value}
//                     placeholder="Select subjects"
//                     variant="default"
//                     animation={2}
//                     maxCount={3}
//                   />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="img"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Profile Photo</FormLabel>
//                   <FormControl>
//                     <Popover>
//                       <PopoverTrigger className="w-full">
//                         <Button
//                           type="button"
//                           variant="outline"
//                           className="flex items-center gap-2 w-full"
//                         >
//                           <Upload className="size-4" />
//                           <span>
//                             {field?.value ? "Update Image" : "Upload Image"}
//                           </span>
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent>
//                         <FileUpload
//                           endpoint="teacherImage"
//                           onChange={(url) => {
//                             if (url) {
//                               field.onChange(url);
//                               setImg(url);
//                             }
//                           }}
//                         />
//                       </PopoverContent>
//                     </Popover>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <Button
//             className="flex items-center gap-2 capitalize"
//             type="submit"
//             variant="secondary"
//             disabled={isPending}
//           >
//             {isPending && <Loader className="size-4 animate-spin" />}
//             {type === "create" && isPending
//               ? "Creating"
//               : type === "update" && isPending
//               ? "Updating"
//               : type === "create"
//               ? "Create"
//               : "Update"}
//           </Button>
//         </form>
//       </Form>
//     </>
//   );
// }
