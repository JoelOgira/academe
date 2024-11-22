"use server";

import { Prisma } from "@prisma/client";
import prisma from "./prisma";
import { subjectSchema, SubjectSchema } from "./form-validation-schema";

export const createSubject = async (
  data: SubjectSchema
): Promise<{ success: boolean; error: string; subjectId?: number }> => {
  try {
    const { name, teachers } = subjectSchema.parse(data);

    if (!name) {
      throw new Error("Subject name is required");
    }

    const existingSubject = await prisma.subject.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingSubject) {
      return {
        success: false,
        error: "A subject with this name already exists",
      };
    }

    const newSubject = await prisma.subject.create({
      data: {
        name,
        teachers: {
          connect: teachers.map((teacher) => ({ id: teacher.id })),
        },
      },
    });

    return { success: true, error: "", subjectId: newSubject.id };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("A subject with this name already exists");
      }
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong please try again",
    };
  }
};

export const updateSubject = async (
  id: number,
  data: SubjectSchema
): Promise<{ success: boolean; error: string }> => {
  try {
    const { name, teachers } = subjectSchema.parse(data);

    if (!name) {
      throw new Error("Subject name is required");
    }

    const existingSubject = await prisma.subject.findUnique({
      where: { id },
    });

    if (!existingSubject) {
      return {
        success: false,
        error: "Subject not found",
      };
    }

    const duplicateSubject = await prisma.subject.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        NOT: {
          id,
        },
      },
    });

    if (duplicateSubject) {
      return {
        success: false,
        error: "A subject with this name already exists",
      };
    }

    await prisma.subject.update({
      where: {
        id,
      },
      data: {
        name,
        teachers: {
          set: teachers.map((teacher) => ({ id: teacher.id })),
        },
      },
    });

    return { success: true, error: "" };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("A subject with this name already exists");
      }
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong please try again",
    };
  }
};

export const deleteSubject = async (
  id: number
): Promise<{ success: boolean; error: string }> => {
  try {
    const existingSubject = await prisma.subject.findUnique({
      where: { id },
    });
    if (!existingSubject) {
      return {
        success: false,
        error: "Subject not found",
      };
    }

    await prisma.subject.delete({
      where: { id },
    });

    return { success: true, error: "" };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong please try again",
    };
  }
};
