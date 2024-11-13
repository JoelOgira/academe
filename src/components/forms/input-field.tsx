import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "postcss";

type InputFieldProps = {
  label: string;
  type?: string;
  name: string;
  defaultValue: string;
  placeholder: string;
  // inputProps: React.InputHTMLAttributes<HTMLInputElement>
};

export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
}: InputFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
