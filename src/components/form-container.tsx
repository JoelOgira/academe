import React from "react";
import FormModal from "./form-modal";
import prisma from "@/lib/prisma";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcements";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

export default async function FormContainer({
  table,
  type,
  data,
  id,
}: FormContainerProps) {
  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
          },
        });

        relatedData = { teachers: subjectTeachers };
        break;

      default:
        break;
    }
  }

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
}
