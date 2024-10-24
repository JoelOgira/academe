import React from "react";
import FormModal from "@/components/form-modal";
import { SearchInput } from "@/components/search-input";
import Table from "@/components/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Announcement, Class, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { formatDate, ITEM_PER_PAGE } from "@/lib/utils";
import TablePagination from "@/components/table-pagination";
import { role } from "@/lib/settings";
import { currentUserId } from "@/lib/settings";

type AnnouncementList = Announcement & { class: Class };

const columns = [
  {
    header: "Announcement Title",
    accessor: "announcementTitle",
  },
  {
    header: "Class",
    accessor: "class",
    className: "hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  ...(role === "admin"
    ? [
        {
          header: "Actions",
          accessor: "actions",
        },
      ]
    : []),
];

const renderRow = (item: AnnouncementList) => (
  <tr
    key={item.id}
    className="text-sm border-b border-gray-200 even:bg-gray-50 hover:bg-lightSkyPurple"
  >
    <td className="p-4">
      <h3 className="font-semibold">{item.title}</h3>
    </td>
    <td className="hidden md:table-cell">{item.class?.name || ""}</td>
    <td className="hidden md:table-cell">{formatDate(item.date)}</td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormModal table="announcements" type="update" data={item} />
            <FormModal table="announcements" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

export default async function AnnouncementListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.AnnouncementWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = {
              contains: value,
              mode: "insensitive",
            };
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
      query.OR = [
        { class: null },
        { class: { lessons: { some: { teacherId: currentUserId! } } } },
      ];
      break;
    case "student":
      query.OR = [
        { class: null },
        { class: { students: { some: { id: currentUserId! } } } },
      ];
      break;
    case "parent":
      query.OR = [
        { class: null },
        { class: { students: { some: { parentId: currentUserId! } } } },
      ];
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: {
        class: { select: { name: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.announcement.count({ where: query }),
  ]);

  return (
    <Card className="flex flex-1 gap-4 flex-col border-none">
      <CardHeader className="p-4 flex-row items-center justify-between space-y-0 md:space-x-6">
        <CardTitle className="hidden md:text-xl md:block">
          All Announcements
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
            {role === "admin" && (
              <FormModal table="announcements" type="create" />
            )}
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
