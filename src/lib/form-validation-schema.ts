import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, {
    message: "subject name is required.",
  }),
  teachers: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .min(1, {
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
