import React from "react";
import FormModal from "@/components/form-modal";
import { SearchInput } from "@/components/search-input";
import Table from "@/components/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { role } from "@/lib/settings";
import Image from "next/image";
import { Prisma, Subject, Teacher } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/utils";
import TablePagination from "@/components/table-pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "subjects list",
};

type SubjectList = Subject & { teachers: Teacher[] };

const columns = [
  {
    header: "Subject Name",
    accessor: "subjectName",
  },
  {
    header: "Teachers",
    accessor: "teachers",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];

const renderRow = (item: SubjectList) => (
  <tr
    key={item.id}
    className="text-sm border-b border-gray-200 even:bg-gray-50 hover:bg-lightSkyPurple"
  >
    <td className="p-4">
      <h3 className="font-semibold">{item.name}</h3>
    </td>
    
    <td className="hidden md:table-cell">
      {item.teachers.map((teacher) => teacher.name).join(", ")}
    </td>

    <td>
      <div className="flex items-center gap-2">
        <FormModal table="subject" type="update" data={item} />
        <FormModal table="subject" type="delete" id={item.id} />
      </div>
    </td>
  </tr>
);

export default async function SubjectListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.SubjectWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            {
              query.name = {
                contains: value,
                mode: "insensitive",
              };
            }
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      include: {
        teachers: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.subject.count({ where: query }),
  ]);

  return (
    <Card className="flex flex-1 gap-4 flex-col border-none">
      <CardHeader className="p-4 flex-row items-center justify-between space-y-0 md:space-x-6">
        <CardTitle className="hidden md:text-xl md:block">
          All Subjects
        </CardTitle>
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
            {role === "admin" && <FormModal table="subject" type="create" />}
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
