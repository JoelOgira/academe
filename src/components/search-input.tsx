"use client";

import { cn } from "@/lib/utils";
import { Input, InputProps } from "./ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const value = (e.currentTarget[0] as HTMLInputElement).value;

      const params = new URLSearchParams(window.location.search);
      params.set("search", value);
      router.push(`${window.location.pathname}?${params}`);
    };

    return (
      <form onSubmit={handleSubmit} className="relative w-full">
        <Input
          type={"text"}
          className={cn("pe-10 rounded-full", className)}
          placeholder="Search..."
          ref={ref}
          {...props}
        />
        <button
          type="submit"
          title={"Search"}
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        >
          <SearchIcon className="size-5" />
        </button>
      </form>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
