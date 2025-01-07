"use server";

import { teacherSchema, TeacherSchema } from "@/lib/form-validation-schema";
import prisma from "@/lib/prisma";
import { createClerkClient } from "@clerk/nextjs/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const createStudent = async (data: TeacherSchema) => {
  try {
    const validatedData = teacherSchema.parse(data);

    const existingUsername = await prisma.teacher.findFirst({
      where: {
        username: {
          equals: validatedData.username.trim(),
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        success: false,
        error: "A teacher with this username already exists",
      };
    }

    if (validatedData.email) {
      const existingEmail = await prisma.teacher.findFirst({
        where: {
          email: {
            equals: validatedData.email.trim(),
            mode: "insensitive",
          },
        },
      });

      if (existingEmail) {
        return {
          success: false,
          error: "A teacher with this email already exists",
        };
      }
    }

    let user;
    try {
      user = await clerkClient.users.createUser({
        username: validatedData.username.trim(),
        password: validatedData.password,
        emailAddress: validatedData.email ? [validatedData.email] : undefined,
        firstName: validatedData.name,
        lastName: validatedData.surname,
        publicMetadata: { role: "teacher" },
      });
    } catch (clerkError: any) {
      console.error("Clerk creation error:", clerkError);
      return {
        success: false,
        error:
          clerkError.errors?.[0]?.message || "Failed to create user account",
      };
    }

    const newTeacher = await prisma.teacher.create({
      data: {
        id: user.id,
        username: validatedData.username.trim(),
        name: validatedData.name,
        surname: validatedData.surname,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address,
        img: validatedData.img || null,
        bloodType: validatedData.bloodType,
        sex: validatedData.sex,
        birthday: new Date(validatedData.birthday),
        subjects: {
          connect:
            validatedData.subjects?.map((subjectId) => ({
              id: parseInt(subjectId),
            })) || [],
        },
      },
    });

    return {
      success: true,
      error: "",
      teacherId: newTeacher.id,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
};

export const updateStudent = async (
  data: Omit<TeacherSchema, "id"> & { id?: string }
) => {
  if (!data.id) {
    return { success: false, error: "Teacher ID is required" };
  }

  try {
    const validatedData = teacherSchema.parse(data);
    const teacherId = data.id as string;

    const existingUsername = await prisma.teacher.findFirst({
      where: {
        username: {
          equals: validatedData.username.trim(),
          mode: "insensitive",
        },
        NOT: {
          id: teacherId,
        },
      },
    });

    if (existingUsername) {
      return {
        success: false,
        error: "A teacher with this username already exists",
      };
    }

    try {
      await clerkClient.users.updateUser(teacherId, {
        username: validatedData.username.trim(),
        ...(validatedData.password &&
          validatedData.password !== "" && {
            password: validatedData.password,
          }),
        firstName: validatedData.name,
        lastName: validatedData.surname,
      });
    } catch (clerkError: any) {
      console.error("Clerk update error:", clerkError);
      return {
        success: false,
        error:
          clerkError.errors?.[0]?.message || "Failed to update user account",
      };
    }

    await prisma.teacher.update({
      where: {
        id: teacherId,
      },
      data: {
        username: validatedData.username.trim(),
        name: validatedData.name,
        surname: validatedData.surname,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address,
        img: validatedData.img || null,
        bloodType: validatedData.bloodType,
        sex: validatedData.sex,
        birthday: new Date(validatedData.birthday),
        subjects: {
          set:
            validatedData.subjects?.map((subjectId) => ({
              id: parseInt(subjectId),
            })) || [],
        },
      },
    });

    return { success: true, error: undefined, teacherId };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
    });
    if (!existingTeacher) {
      return {
        success: false,
        error: "Teacher not found",
      };
    }

    try {
      const clerkUser = await clerkClient.users.getUser(id);
      if (clerkUser) {
        await clerkClient.users.deleteUser(id);
      }
    } catch (clerkError) {
      console.log("Clerk user not found or other Clerk error:", clerkError);
    }

    await prisma.teacher.delete({
      where: { id },
    });

    return { success: true, error: "" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

// "use server";

// import { teacherSchema, TeacherSchema } from "@/lib/form-validation-schema";
// import prisma from "@/lib/prisma";
// import { createClerkClient } from "@clerk/nextjs/server";
// const clerkClient = createClerkClient({
//   secretKey: process.env.CLERK_SECRET_KEY,
// });

// export const createTeacher = async (
//   data: TeacherSchema
// ): Promise<{
//   success: boolean;
//   error: string;
//   teacherId?: string;
// }> => {
//   try {
//     const validatedData = teacherSchema.parse(data);

//     const existingUsername = await prisma.teacher.findFirst({
//       where: {
//         username: {
//           equals: validatedData.username.trim(),
//           mode: "insensitive",
//         },
//       },
//     });

//     if (existingUsername) {
//       return {
//         success: false,
//         error: "A teacher with this username already exists",
//       };
//     }

//     if (validatedData.email) {
//       const existingEmail = await prisma.teacher.findFirst({
//         where: {
//           email: {
//             equals: validatedData.email.trim(),
//             mode: "insensitive",
//           },
//         },
//       });

//       if (existingEmail) {
//         return {
//           success: false,
//           error: "A teacher with this email already exists",
//           teacherId: undefined,
//         };
//       }
//     }

//     let user;
//     try {
//       user = await clerkClient.users.createUser({
//         username: validatedData.username.trim(),
//         password: validatedData.password,
//         emailAddress: validatedData.email ? [validatedData.email] : undefined,
//         firstName: validatedData.name,
//         lastName: validatedData.surname,
//         publicMetadata: { role: "teacher" },
//       });
//     } catch (clerkError: any) {
//       console.error("Clerk creation error:", clerkError);
//       return {
//         success: false,
//         error:
//           clerkError.errors?.[0]?.message || "Failed to create user account",
//         teacherId: undefined,
//       };
//     }

//     const newTeacher = await prisma.teacher.create({
//       data: {
//         id: user.id,
//         username: validatedData.username.trim(),
//         name: validatedData.name,
//         surname: validatedData.surname,
//         email: validatedData.email || null,
//         phone: validatedData.phone || null,
//         address: validatedData.address,
//         img: validatedData.img || null,
//         bloodType: validatedData.bloodType,
//         sex: validatedData.sex,
//         birthday: new Date(validatedData.birthday),
//         subjects: {
//           connect:
//             validatedData.subjects?.map((subjectId) => ({
//               id: parseInt(subjectId),
//             })) || [],
//         },
//       },
//     });

//     return {
//       success: true,
//       error: "",
//       teacherId: newTeacher.id,
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       success: false,
//       error:
//         error instanceof Error ? error.message : "An unexpected error occurred",
//     };
//   }
// };

// export const updateTeacher = async (id: string, data: TeacherSchema) => {
//   if (!id) {
//     return { success: false, error: "Teacher ID is required" };
//   }

//   try {
//     const validatedData = teacherSchema.parse(data);

//     const existingUsername = await prisma.teacher.findFirst({
//       where: {
//         username: {
//           equals: validatedData.username.trim(),
//           mode: "insensitive",
//         },
//         NOT: {
//           id,
//         },
//       },
//     });

//     if (existingUsername) {
//       return {
//         success: false,
//         error: "A teacher with this username already exists",
//       };
//     }

//     try {
//       await clerkClient.users.updateUser(id, {
//         username: validatedData.username.trim(),
//         ...(validatedData.password &&
//           validatedData.password !== "" && {
//             password: validatedData.password,
//           }),
//         firstName: validatedData.name,
//         lastName: validatedData.surname,
//       });
//     } catch (clerkError: any) {
//       console.error("Clerk update error:", clerkError);
//       return {
//         success: false,
//         error:
//           clerkError.errors?.[0]?.message || "Failed to update user account",
//       };
//     }

//     await prisma.teacher.update({
//       where: { id },
//       data: {
//         username: validatedData.username.trim(),
//         name: validatedData.name,
//         surname: validatedData.surname,
//         email: validatedData.email || null,
//         phone: validatedData.phone || null,
//         address: validatedData.address,
//         img: validatedData.img || null,
//         bloodType: validatedData.bloodType,
//         sex: validatedData.sex,
//         birthday: new Date(validatedData.birthday),
//         subjects: {
//           set:
//             validatedData.subjects?.map((subjectId) => ({
//               id: parseInt(subjectId),
//             })) || [],
//         },
//       },
//     });

//     return { success: true, error: undefined };
//   } catch (error) {
//     return {
//       success: false,
//       error:
//         error instanceof Error ? error.message : "An unexpected error occurred",
//     };
//   }
// };

// export const deleteTeacher = async (
//   id: string
// ): Promise<{ success: boolean; error: string }> => {
//   try {
//     const existingTeacher = await prisma.teacher.findUnique({
//       where: { id },
//     });
//     if (!existingTeacher) {
//       return {
//         success: false,
//         error: "Teacher not found",
//       };
//     }

//     try {
//       const clerkUser = await clerkClient.users.getUser(id);
//       if (clerkUser) {
//         await clerkClient.users.deleteUser(id);
//       }
//     } catch (clerkError) {
//       console.log("Clerk user not found or other Clerk error:", clerkError);
//     }

//     await prisma.teacher.delete({
//       where: { id },
//     });

//     return { success: true, error: "" };
//   } catch (error) {
//     console.log(error);
//     return {
//       success: false,
//       error:
//         error instanceof Error
//           ? error.message
//           : "Something went wrong please try again",
//     };
//   }
// };

// export const createTeacher = async (
//   data: TeacherSchema
// ): Promise<{ success: boolean; error: string; teacherId?: string }> => {
//   try {
//     const {
//       username,
//       password,
//       name,
//       surname,
//       email,
//       phone,
//       address,
//       img,
//       bloodType,
//       sex,
//       birthday,
//       subjects,
//     } = teacherSchema.parse(data);

//     const existingUsername = await prisma.teacher.findFirst({
//       where: {
//         username: {
//           equals: username.trim(),
//           mode: "insensitive",
//         },
//       },
//     });

//     if (existingUsername) {
//       return {
//         success: false,
//         error: "A teacher with this username already exists",
//       };
//     }

//     if (email) {
//       const existingEmail = await prisma.teacher.findFirst({
//         where: {
//           email: {
//             equals: email.trim(),
//             mode: "insensitive",
//           },
//         },
//       });

//       if (existingEmail) {
//         return {
//           success: false,
//           error: "A teacher with this email already exists",
//         };
//       }
//     }

//     // Create Clerk user with proper error handling
//     let user;
//     try {
//       user = await clerkClient.users.createUser({
//         username,
//         password,
//         emailAddress: email ? [email] : undefined,
//         firstName: name,
//         lastName: surname,
//         publicMetadata: { role: "teacher" },
//       });
//     } catch (clerkError: any) {
//       console.error("Clerk creation error:", clerkError);

//       // Return specific error messages from Clerk
//       if (clerkError.errors?.length > 0) {
//         const errorMessages = clerkError.errors
//           .map((e: any) => e.longMessage || e.message)
//           .join(". ");
//         return {
//           success: false,
//           error: errorMessages,
//         };
//       }

//       return {
//         success: false,
//         error: "Failed to create user account",
//       };
//     }

//     // Create teacher in database
//     const newTeacher = await prisma.teacher.create({
//       data: {
//         id: user.id,
//         username,
//         name,
//         surname,
//         email: email || null,
//         phone: phone || null,
//         address,
//         img: img || null,
//         bloodType,
//         sex,
//         birthday: new Date(birthday),
//         subjects: {
//           connect: subjects?.map((id) => ({ id: parseInt(id) })),
//         },
//       },
//     });

//     return { success: true, error: "", teacherId: newTeacher.id };
//   } catch (error) {
//     console.error("Teacher creation error:", error);
//     return {
//       success: false,
//       error:
//         error instanceof Error
//           ? error.message
//           : "Something went wrong please try again",
//     };
//   }
// };

// export const updateTeacher = async (
//   id: string,
//   data: TeacherSchema
// ): Promise<{ success: boolean; error: string }> => {
//   try {
//     const {
//       username,
//       password,
//       name,
//       surname,
//       email,
//       phone,
//       address,
//       img,
//       bloodType,
//       sex,
//       birthday,
//       subjects,
//     } = teacherSchema.parse(data);

//     const existingUsername = await prisma.teacher.findFirst({
//       where: {
//         username: {
//           equals: username.trim(),
//           mode: "insensitive",
//         },
//         NOT: {
//           id,
//         },
//       },
//     });

//     if (existingUsername) {
//       return {
//         success: false,
//         error: "A teacher with this username already exists",
//       };
//     }

//     if (email) {
//       const existingEmail = await prisma.teacher.findFirst({
//         where: {
//           email: {
//             equals: email.trim(),
//             mode: "insensitive",
//           },
//           NOT: {
//             id,
//           },
//         },
//       });

//       if (existingEmail) {
//         return {
//           success: false,
//           error: "A teacher with this email already exists",
//         };
//       }
//     }

//     // Update Clerk user with proper error handling
//     try {
//       const clerkUpdateData: any = {
//         username,
//         firstName: name,
//         lastName: surname,
//         emailAddress: email ? [email] : undefined,
//         publicMetadata: { role: "teacher" },
//       };

//       // Only include password if it's being changed
//       if (password && password.trim() !== "") {
//         clerkUpdateData.password = password;
//       }

//       await clerkClient.users.updateUser(id, clerkUpdateData);
//     } catch (clerkError: any) {
//       console.error("Clerk update error:", clerkError);
//       if (clerkError.errors?.length > 0) {
//         const errorMessages = clerkError.errors
//           .map((e: any) => e.longMessage || e.message)
//           .join(". ");
//         return {
//           success: false,
//           error: errorMessages,
//         };
//       }
//       return {
//         success: false,
//         error: "Failed to update user account",
//       };
//     }

//     // Update teacher in database
//     try {
//       await prisma.teacher.update({
//         where: { id },
//         data: {
//           username,
//           name,
//           surname,
//           email: email || null,
//           phone: phone || null,
//           address,
//           img: img || null,
//           bloodType,
//           sex,
//           birthday: new Date(birthday),
//           subjects: {
//             set: subjects?.map((id) => ({ id: parseInt(id) })),
//           },
//         },
//       });
//     } catch (prismaError: any) {
//       console.error("Prisma update error:", prismaError);
//       return {
//         success: false,
//         error: "Failed to update teacher information in database",
//       };
//     }

//     return { success: true, error: "" };
//   } catch (error) {
//     console.error("Teacher update error:", error);
//     return {
//       success: false,
//       error:
//         error instanceof Error
//           ? error.message
//           : "Something went wrong please try again",
//     };
//   }
// };
