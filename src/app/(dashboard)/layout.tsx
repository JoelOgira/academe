import Menu from "@/components/menu";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen border-b">
      {/* LEFT */}
      <div className="w-[14%] p-4 md:w-[8%] lg:w-[16%] xl:w-[14%] space-y-4 ">
        <Link
          href={"/"}
          className="flex items-center justify-center  gap-x-2 lg:justify-start"
        >
          <Image
            src={"/logo.png"}
            alt="logo"
            width={32}
            height={32}
            className="italic"
          />
          <span className="hidden font-bold lg:block">academe</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="flex flex-col gap-4 w-[86%] p-4 bg-backgroundBlue md:w-[92%] lg:w-[84%] xl:w-[86%] ">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

{
  /* <div className="overflow-scroll flex flex-col gap-4 w-[86%] p-4 bg-backgroundBlue md:w-[92%] lg:w-[84%] xl:w-[86%]" /> */
}
