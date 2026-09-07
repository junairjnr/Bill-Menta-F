"use client";

import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function FilterInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Input
      {...props}
      className={cn("h-8 text-sm", className)}
    />
  );
}
