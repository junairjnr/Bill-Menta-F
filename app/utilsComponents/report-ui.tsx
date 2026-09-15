"use client";

import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

import BackPanel from "./BackPanel";
import PageHeader from "./PageHeader";
import ReportFilterBar from "./ReportFilterBar";
import SummaryCard from "./SummaryCard";
import ReportExport from "./ReportExport";
import { Button } from "@/components/ui/button";

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const fmtMoney = (n: number) => `₹ ${n.toFixed(2)}`;

/** Invoice / return summary panel (forms + view pages) */
export const invoiceSummaryPanelClass =
  "w-full min-w-[280px] max-w-md space-y-2.5 text-base lg:ml-auto";
export const invoiceViewSummaryPanelClass =
  "w-full min-w-[280px] max-w-md space-y-2.5 text-base";
export const invoiceSummaryGrandTotalClass =
  "flex justify-between py-2 text-lg font-bold text-gray-900 border-t pt-2";

export function reportRowClass(index: number, extra?: string) {
  return cn(
    "border-b border-gray-50 transition-colors hover:bg-gray-100/60",
    index % 2 === 1 && "bg-gray-50/50",
    extra,
  );
}

export function FilterField({
  label, required, wide, children,
}: { label: string; required?: boolean; wide?: boolean; children: ReactNode }) {
  return (
    <div className={cn("min-w-0", wide && "sm:col-span-2")}>
      <label className="mb-1 block text-[11px] font-medium text-gray-500">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export { FilterSelect, FilterInput, FilterCheckbox } from "@/app/formComponents/FilterFields";
export type { FilterOption } from "@/app/formComponents/FilterFields";
/** Back-compat aliases */
export { FilterSelect as ReportSelect, FilterInput as ReportInput, FilterCheckbox as ReportCheckbox } from "@/app/formComponents/FilterFields";
export { FilterSelect as ListFilterSelect } from "@/app/formComponents/FilterFields";
export type { FilterOption as ListFilterOption } from "@/app/formComponents/FilterFields";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon?: ReactNode }> = {
    confirmed: { cls: "bg-emerald-50 text-emerald-700", icon: <Check className="h-3 w-3" /> },
    draft:     { cls: "bg-amber-50 text-amber-700" },
    cancelled: { cls: "bg-red-50 text-red-600", icon: <X className="h-3 w-3" /> },
    retail:    { cls: "bg-blue-50 text-blue-700" },
    wholesale: { cls: "bg-violet-50 text-violet-700" },
  };
  const meta = map[status] ?? { cls: "bg-gray-50 text-gray-600" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${meta.cls}`}>
      {meta.icon}
      {status}
    </span>
  );
}

export function ReportTable({
  columns, children, footer,
}: { columns: { label: string; align?: "left" | "right" }[]; children: ReactNode; footer?: ReactNode }) {
  return (
    <>
      <div className="max-h-[calc(100vh-14rem)] overflow-auto">
        <table className="w-full min-w-max text-sm">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-gray-100">
              {columns.map((c, i) => (
                <th key={i} className={`px-4 py-3 text-xs font-medium text-gray-500 whitespace-nowrap ${c.align === "right" ? "text-right" : "text-left"}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_td]:whitespace-nowrap">{children}</tbody>
        </table>
      </div>
      {footer}
    </>
  );
}

/** Scrollable table shell for custom report pages (history, shop, etc.) */
export function ReportScrollTable({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <>
      <div className="max-h-[calc(100vh-14rem)] overflow-auto">{children}</div>
      {footer}
    </>
  );
}

export const reportTableClass =
  "w-full min-w-max text-sm [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap";

/** Invoice item tables — no inner scroll; single-line cells */
export const invoiceItemsTableClass =
  "w-full text-sm [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap [&_th]:px-3 [&_td]:px-3";

export function ReportPagination({
  page, totalPages, total, count, hasNext, onPage,
}: { page: number; totalPages: number; total: number; count: number; hasNext?: boolean; onPage: (p: number) => void }) {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex flex-wrap justify-between items-center gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-sm">
      <p className="text-gray-500">Showing <span className="font-medium text-gray-700">{count}</span> of <span className="font-medium text-gray-700">{total}</span></p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={() => onPage(page - 1)} disabled={page === 1}>Prev</Button>
        {pages.map((p) => (
          <Button key={p} variant={page === p ? "default" : "outline"} size="sm" className="min-w-8" onClick={() => onPage(p)}>{p}</Button>
        ))}
        <Button variant="outline" size="sm" onClick={() => onPage(page + 1)} disabled={!hasNext}>Next</Button>
      </div>
    </div>
  );
}

export function ListFilterBar({
  children,
  trailing,
  align = "center",
}: {
  children: ReactNode;
  trailing?: ReactNode;
  align?: "center" | "end";
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap justify-between gap-3 rounded-lg bg-white p-4 shadow-sm",
        align === "end" ? "items-end" : "items-center",
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-wrap gap-3",
          align === "end" ? "items-end" : "items-center",
        )}
      >
        {children}
      </div>
      {trailing ? <div className="flex shrink-0 items-center">{trailing}</div> : null}
    </div>
  );
}

export function ReportShell({
  title, description, onClear, filters, filterInline, activeFilterCount = 0,
  summary, summaryLoading, exportType, exportParams, children,
}: {
  title: string; description: string; onClear?: () => void;
  filters?: ReactNode; filterInline?: ReactNode; activeFilterCount?: number;
  summary?: { label: string; value: string | number; highlight?: boolean }[];
  summaryLoading?: boolean;
  exportType?: string;
  exportParams?: Record<string, string | undefined>;
  children: ReactNode;
}) {
  const showFilters = filters != null || filterInline != null;

  return (
    <BackPanel>
      <div className="mx-auto max-w-[1600px] space-y-4 p-4">
        <PageHeader
          title={title}
          description={description}
          actions={
            exportType ? (
              <ReportExport
                variant="inline"
                reportType={exportType}
                title={title}
                params={exportParams}
              />
            ) : undefined
          }
        />
        {summary && summary.length > 0 && (
          <SummaryCard items={summary} loading={summaryLoading} />
        )}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {showFilters && (
            <ReportFilterBar
              onClear={onClear ?? (() => {})}
              inline={filterInline}
              activeCount={activeFilterCount}
            >
              {filters}
            </ReportFilterBar>
          )}
          {children}
        </div>
      </div>
    </BackPanel>
  );
}

export function ReportError({ message }: { message?: string }) {
  return (
    <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message ?? "Failed to load report data. Please try again."}
    </div>
  );
}

export function TableState({ colSpan, loading, empty, error, message }: { colSpan: number; loading?: boolean; empty?: boolean; error?: boolean; message?: string }) {
  if (!loading && !empty && !error) return null;
  return (
    <tr>
      <td colSpan={colSpan} className={`px-4 py-16 text-center text-sm ${error ? "text-red-500" : "text-gray-400"}`}>
        {loading ? "Loading..." : error ? (message ?? "Failed to load data") : (message ?? "No records found")}
      </td>
    </tr>
  );
}

export const MOVEMENT_META: Record<string, { label: string; color: string; dir: "in" | "out" }> = {
  purchase_in:     { label: "Purchase In",     color: "bg-emerald-50 text-emerald-700", dir: "in"  },
  purchase_return: { label: "Purchase Return", color: "bg-orange-50 text-orange-700",   dir: "out" },
  sales_out:       { label: "Sales Out",       color: "bg-red-50 text-red-600",         dir: "out" },
  sales_return:    { label: "Sales Return",    color: "bg-blue-50 text-blue-700",       dir: "in"  },
  transfer_in:     { label: "Transfer In",     color: "bg-teal-50 text-teal-700",       dir: "in"  },
  transfer_out:    { label: "Transfer Out",    color: "bg-purple-50 text-purple-700",   dir: "out" },
  adjustment_in:   { label: "Adjustment In",   color: "bg-gray-50 text-gray-700",       dir: "in"  },
  adjustment_out:  { label: "Adjustment Out",  color: "bg-gray-50 text-gray-600",       dir: "out" },
  opening_stock:   { label: "Opening Stock",   color: "bg-amber-50 text-amber-700",     dir: "in"  },
};

