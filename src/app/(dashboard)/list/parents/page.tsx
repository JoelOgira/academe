import Pagination from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import Table from "@/components/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parentsData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Parent = {
  id: number;
  name: string;
  students: string[];
  email?: string;
  phone?: string;
  address?: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Student Name",
    accessor: "studentName",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];

export default function ParentListPage() {
  const renderRow = (item: Parent) => (
    <tr
      key={item.id}
      className="text-sm border-b border-gray-200 even:bg-gray-50 hover:bg-lightSkyPurple"
    >
      <td className="p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500"> {item?.email} </p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.students.join(",")}</td>
      <td className="hidden lg:table-cell">{item?.phone}</td>
      <td className="hidden lg:table-cell">{item?.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/parents/${item.id}`}>
            <button className="size-7 flex items-center justify-center rounded-full bg-skyBlue">
              <Image src="/edit.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <button className="size-7 flex items-center justify-center rounded-full bg-skyPurple">
              <Image src="/delete.png" alt="" width={16} height={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <Card className="flex flex-1 gap-4 flex-col border-none">
      <CardHeader className="p-4 flex-row items-center justify-between space-y-0 md:space-x-6">
        <CardTitle className="hidden md:text-xl md:block">
          All Parents
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
            <button className="size-8 bg-skyYellow rounded-full flex justify-center items-center">
              <Image width={14} height={14} alt="plus icon" src="/plus.png" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Table columns={columns} renderRow={renderRow} data={parentsData} />
      </CardContent>
      <Pagination />
    </Card>
  );
}
