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
