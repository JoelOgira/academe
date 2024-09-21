import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MoreHorizontal } from "lucide-react";

export default function UserCard({ type }: { type: string }) {
  return (
    <Card className="odd:bg-skyPurple even:bg-skyYellow rounded-2xl border-none flex-1 p-4 space-y-3 min-w-[130px]">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center justify-between">
          <div className="text-[11px] bg-white py-1 px-2 rounded-full">
            {new Date().getFullYear()}/{new Date().getDate()}
          </div>
          <MoreHorizontal className="size-4 text-white" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="font-semibold text-2xl">6,9420</p>
      </CardContent>
      <CardFooter className="text-sm p-0 text-gray-500 font-medium">
        {type}
      </CardFooter>
    </Card>
  );
}
