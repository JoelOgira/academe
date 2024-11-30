import React from "react";
import FormModal from "@/components/form-modal";
import { SearchInput } from "@/components/search-input";
import Table from "@/components/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Class, Event, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { formatDate, ITEM_PER_PAGE } from "@/lib/utils";
import TablePagination from "@/components/table-pagination";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "events list",
};

type EventsList = Event & { class: Class };

export default async function EventListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { sessionClaims, userId } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.EventWhereInput = {};

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

  //  ROLE CONDITIONS
  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.OR = [
        { classId: null },
        { class: { lessons: { some: { teacherId: currentUserId! } } } },
      ];
      break;
    case "student":
      query.OR = [
        { classId: null },
        {
          class: {
            lessons: {
              some: { class: { students: { some: { id: currentUserId! } } } },
            },
          },
        },
      ];
      break;

    case "parent":
      query.OR = [
        { classId: null },
        {
          class: {
            lessons: {
              some: {
                class: {
                  students: {
                    some: {
                      parentId: currentUserId!,
                    },
                  },
                },
              },
            },
          },
        },
      ];

    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      include: {
        class: { select: { name: true } },
      },
    }),
    prisma.event.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Event Title",
      accessor: "eventTitle",
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
    {
      header: "Start Time",
      accessor: "startTime",
      className: "hidden md:table-cell",
    },
    {
      header: "End Time",
      accessor: "endTime",
      className: "hidden md:table-cell",
    },
    ...(role === "Admin" || role === "Teacher"
      ? [
          {
            header: "Actions",
            accessor: "actions",
          },
        ]
      : []),
  ];

  const renderRow = (item: EventsList) => (
    <tr
      key={item.id}
      className="text-sm border-b border-gray-200 even:bg-gray-50 hover:bg-lightSkyPurple"
    >
      <td className="p-4">
        <h3 className="font-semibold">{item.title}</h3>
      </td>
      <td className="hidden md:table-cell">{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell">{formatDate(item.startTime)}</td>
      <td className="hidden md:table-cell">
        {item.startTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </td>
      <td className="hidden md:table-cell">
        {item.endTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="event" type="update" data={item} />
              <FormModal table="event" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <Card className="flex flex-1 gap-4 flex-col border-none">
      <CardHeader className="p-4 flex-row items-center justify-between space-y-0 md:space-x-6">
        <CardTitle className="hidden md:text-xl md:block">All Events</CardTitle>
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
            {role === "admin" && <FormModal table="event" type="create" />}
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
