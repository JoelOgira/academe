import { cn } from "@/lib/utils";
import { Input, InputProps } from "./ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pe-10", className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? "Hide Password" : "Show Password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        >
          {showPassword ? (
            <EyeIcon className="size-5" />
          ) : (
            <EyeOffIcon className="size-5" />
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
