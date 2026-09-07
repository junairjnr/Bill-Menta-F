"use client";

import type { ReactNode, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  value: string;
  placeholder?: string;
  options?: FilterOption[];
  onChange: (value: string) => void;
  className?: string;
  children?: ReactNode;
}

export default function FilterSelect({
  value,
  placeholder = "All",
  options,
  onChange,
  className,
  children,
  disabled,
  ...props
}: FilterSelectProps) {
  return (
    <InputGroup className={cn("h-8 w-full", className)}>
      <select
        {...props}
        value={value}
        disabled={disabled}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 flex-1 cursor-pointer appearance-none bg-transparent px-2.5 text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">{placeholder}</option>
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : children}
      </select>
      <InputGroupAddon align="inline-end" className="pointer-events-none pr-2">
        <ChevronDown className="size-4 text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  );
}
