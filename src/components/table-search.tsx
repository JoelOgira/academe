import { cn } from "@/lib/utils";
import { Input, InputProps } from "./ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative">
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
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
