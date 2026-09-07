"use client";

import { useState } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReportFilterBarProps {
  children: React.ReactNode;
  inline?: React.ReactNode;
  onClear: () => void;
  activeCount?: number;
}

export default function ReportFilterBar({
  children,
  inline,
  onClear,
  activeCount = 0,
}: ReportFilterBarProps) {
  const [open, setOpen] = useState(false);
  const hasActive = activeCount > 0;

  return (
    <div className="border-b border-gray-100">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors",
            open
              ? "border-gray-300 bg-gray-50 text-gray-900"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-gray-500" strokeWidth={2} />
          Filter
          {hasActive && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </button>

        {inline}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            onClear();
            setOpen(false);
          }}
          disabled={!hasActive}
          className="ml-auto h-8 gap-1 px-2 text-xs text-gray-500 hover:text-gray-800 disabled:opacity-40"
        >
          <RotateCcw className="h-3 w-3" />
          Clear
        </Button>
      </div>

      {open && (
        <div className="grid grid-cols-2 gap-2 border-t border-gray-100 bg-gray-50/30 px-4 py-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {children}
        </div>
      )}
    </div>
  );
}
