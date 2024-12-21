import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, {
    message: "subject name is required.",
  }),
  teachers: z.array(z.string()).min(1, {
    message: "At least one teacher is required",
  }),
});
export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required" }),
  capacity: z.coerce
    .number({
      invalid_type_error: "Capacity must be a number and is required",
    })
    .positive({ message: "Capacity must be greater than 0" })
    .min(1, { message: "Class capacity is required!" }),
  gradeId: z.coerce
    .number({ invalid_type_error: "Grade is required" })
    .min(1, { message: "Grade name is required!" }),
  supervisorId: z.coerce.string().optional(),
});
export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .max(20, {
      message: "Username must be at most 20 characters.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .optional()
    .or(z.literal("")),
  name: z.string().min(3, {
    message: "First name must be at least 3 characters.",
  }),
  surname: z.string().min(3, {
    message: "Surname must be at least 3 characters.",
  }),
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  img: z.string().optional(),
  bloodType: z.string().optional(),
  birthday: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Gender is required" }),
  subjects: z.array(z.string()).optional(),
});
export type TeacherSchema = z.infer<typeof teacherSchema>;
