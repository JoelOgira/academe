import React from "react";
import FormModal from "@/components/form-modal";
import { SearchInput } from "@/components/search-input";
import Table from "@/components/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import TablePagination from "@/components/table-pagination";
import { Prisma, Exam, Teacher, Class, Subject } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "exams list",
};

type ExamsList = Exam & {
  lesson: { subject: Subject; class: Class; teacher: Teacher };
};

export default async function ExamListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { sessionClaims, userId } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.ExamWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.lesson = {
              teacherId: value,
            };
          case "classId":
            query.lesson = {
              classId: parseInt(value),
            };
            break;
          case "search":
            {
              query.OR = [
                { lesson: { subject: { name: { contains: value } } } },
                {
                  lesson: {
                    OR: [
                      {
                        teacher: {
                          name: { contains: value, mode: "insensitive" },
                        },
                      },
                      {
                        teacher: {
                          surname: { contains: value, mode: "insensitive" },
                        },
                      },
                    ],
                  },
                },
              ];
            }
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.lesson = { teacherId: currentUserId! };
      break;
    case "student":
      query.lesson = {
        class: {
          students: {
            some: {
              id: currentUserId!,
            },
          },
        },
      };
      break;
    case "parent":
      query.lesson = {
        class: {
          students: {
            some: {
              parentId: currentUserId!,
            },
          },
        },
      };
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        lesson: {
          include: {
            class: { select: { name: true } },
            subject: { select: { name: true } },
            teacher: { select: { id: true, name: true, surname: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.exam.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Subject Name",
      accessor: "subjectName",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "actions",
          },
        ]
      : []),
  ];

  const renderRow = (item: ExamsList) => {
    return (
      <tr
        key={item.id}
        className="text-sm border-b border-gray-200 even:bg-gray-50 hover:bg-lightSkyPurple"
      >
        <td className="p-4">
          <h3 className="font-semibold">{item.lesson.subject.name}</h3>
        </td>
        <td>{item.lesson.class.name}</td>
        <td className="hidden md:table-cell">{`${item.lesson.teacher.name} ${item.lesson.teacher.surname}`}</td>
        <td className="hidden md:table-cell">{formatDate(item.startTime)}</td>
        <td>
          <div className="flex items-center gap-2">
            {(role === "admin" || role == "teacher") && (
              <>
                <FormModal table="exam" type="update" data={item} />
                <FormModal table="exam" type="delete" id={item.id} />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <Card className="flex flex-1 gap-4 flex-col border-none">
      <CardHeader className="p-4 flex-row items-center justify-between space-y-0 md:space-x-6">
        <CardTitle className="hidden md:text-xl md:block">All Exams</CardTitle>
        <div className="w-full flex flex-col justify-center items-center gap-4 md:flex-row md:w-auto ">
          <SearchInput />
          <div className="flex items-center gap-4 justify-end">
            <button className="size-8 bg-skyYellow rounded-full flex justify-center items-center">
              <Image
                width={14}
                height={14}
                alt="filter icon"
                src="/filter.png"
              />
            </button>
            <button className="size-8 bg-skyYellow rounded-full flex justify-center items-center">
              <Image width={14} height={14} alt="sort icon" src="/sort.png" />
            </button>
            {role === "admin" && <FormModal table="exam" type="create" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Table columns={columns} renderRow={renderRow} data={data} />
      </CardContent>
      <TablePagination page={p} count={count} />
    </Card>
  );
}
