import Image from "next/image";
import { SearchInput } from "./search-input";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Navbar() {
  const user = await currentUser();

  const role = user?.publicMetadata?.role as string;

  return (
    <div className="flex items-center justify-between">
      {/* SEARCH */}
      <div className="hidden sm:flex">
        <SearchInput />
      </div>

      {/* ICONS */}
      <div className="flex items-center gap-6 w-full justify-end">
        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-white">
          <Image
            src={"/message.png"}
            alt="Message Icon"
            className="italic"
            width={20}
            height={20}
          />
        </div>
        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-white relative">
          <Image
            src={"/announcement.png"}
            alt="Message Icon"
            className="italic"
            width={20}
            height={20}
          />
          <div className="absolute -top-3 -right-3 size-5 flex items-center justify-center bg-purple-500 rounded-full text-white text-xs">
            7
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm leading-3 font-medium">
            {user?.username
              ? user?.username
              : user?.firstName + " " + user?.lastName}
          </span>
          <span className="text-[13px] text-muted-foreground text-right">
            {role}
          </span>
        </div>
        <UserButton />
      </div>
    </div>
  );
}
