import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string().min(1, {
    message: "subject name is required.",
  }),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;
