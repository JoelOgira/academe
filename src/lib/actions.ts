"use server";
import prisma from "./prisma";
import {
  classSchema,
  ClassSchema,
  subjectSchema,
  SubjectSchema,
} from "./form-validation-schema";

// Subject
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
          connect: teachers?.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    return { success: true, error: "", subjectId: newSubject.id };
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
          set: teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
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

// Class
export const createClass = async (
  data: ClassSchema
): Promise<{ success: boolean; error: string }> => {
  try {
    const { name, capacity, gradeId, supervisorId } = classSchema.parse(data);

    const duplicateClass = await prisma.class.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (duplicateClass) {
      return {
        success: false,
        error: "Class name already exists.",
      };
    }

    await prisma.class.create({
      data: {
        name,
        capacity,
        gradeId,
        supervisorId,
      },
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

export const updateClass = async (
  id: number,
  data: ClassSchema
): Promise<{ success: boolean; error: string }> => {
  try {
    const { name, capacity, gradeId, supervisorId } = classSchema.parse(data);

    const existingClass = await prisma.class.findUnique({
      where: { id },
    });

    if (!existingClass) {
      return {
        success: false,
        error: "The class not found",
      };
    }

    const duplicateClass = await prisma.class.findFirst({
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

    if (duplicateClass) {
      return {
        success: false,
        error: "Class name already exists.",
      };
    }

    // const classCapacity = parseFloat(capacity)

    await prisma.class.update({
      where: { id },
      data: {
        name,
        capacity,
        gradeId,
        supervisorId,
      },
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

export const deleteClass = async (
  id: number
): Promise<{ success: boolean; error: string }> => {
  try {
    const existingClass = await prisma.class.findUnique({
      where: { id },
    });

    if (!existingClass) {
      return {
        success: false,
        error: "The class not found",
      };
    }

    await prisma.class.delete({
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
