import FormModal from "@/components/form-modal";
import { SearchInput } from "@/components/search-input";
import Table from "@/components/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { role } from "@/lib/settings";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/utils";
import { Teacher, Subject, Class, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import TablePagination from "@/components/table-pagination";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Classes",
    accessor: "classes",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  ...(role === "admin"
    ? [
        {
          header: "Address",
          accessor: "address",
          className: "hidden lg:table-cell",
        },
        {
          header: "Actions",
          accessor: "actions",
        },
      ]
    : []),
];

const renderRow = (item: TeacherList) => (
  <tr
    key={item.id}
    className="text-sm border-b border-gray-200 even:bg-gray-50 hover:bg-lightSkyPurple"
  >
    <td className="flex items-center gap-4 p-4">
      <Image
        src={item.img || "/avatar-placeholder.png"}
        alt=""
        width={40}
        height={40}
        className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <Link className="hover:underline" href={`/list/teachers/${item.id}`}>
          <h3 className="font-semibold">{item.name}</h3>
        </Link>
        <p className="text-xs text-gray-500"> {item?.email} </p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.username}</td>
    <td className="hidden md:table-cell">
      {" "}
      {item.subjects.map((subject) => subject.name).join(",")}{" "}
    </td>
    <td className="hidden md:table-cell">
      {item.classes.map((classItem) => classItem.name).join(",")}
    </td>
    <td className="hidden lg:table-cell">{item?.phone}</td>
    {role === "admin" && (
      <>
        <td className="hidden lg:table-cell">{item?.address}</td>
        <td>
          <div className="flex items-center gap-2">
            <Link href={`/list/teachers/${item.id}`}>
              <button className="size-7 flex items-center justify-center rounded-full bg-skyBlue">
                <Image src="/view.png" alt="" width={16} height={16} />
              </button>
            </Link>
            <FormModal table="teacher" type="delete" id={item?.id} />
          </div>
        </td>
      </>
    )}
  </tr>
);

export default async function TeacherListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { page, ...queryParams } = searchParams;

  const p = queryParams.search ? 1 : page ? parseInt(page) : 1;

  // URL Params conditions
  const query: Prisma.TeacherWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lessons = {
              some: {
                classId: parseInt(value),
              },
            };
            break;
          case "search":
            query.name = {
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

  const [teachersData, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        classes: true,
        subjects: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        name: "asc",
      },
    }),
    prisma.teacher.count({ where: query }),
  ]);

  return (
    <Card className="flex flex-1 gap-4 flex-col border-none">
      <CardHeader className="p-4 flex-row items-center justify-between space-y-0 md:space-x-6">
        <CardTitle className="hidden md:text-xl md:block">
          All Teachers
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
            {role === "admin" && <FormModal table="teacher" type="create" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Table columns={columns} renderRow={renderRow} data={teachersData} />
      </CardContent>
      <TablePagination page={p} count={count} />
    </Card>
  );
}
