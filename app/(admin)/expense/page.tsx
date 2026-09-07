"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import PageHeader from "@/app/utilsComponents/PageHeader";
import ReportExport from "@/app/utilsComponents/ReportExport";
import { ListFilterBar } from "@/app/utilsComponents/report-ui";
import { Button } from "@/components/ui/button";
import { useExpenses } from "@/app/hooks/expenseHook/useExpense";
import { PAGE_SIZE, listRowNumber } from "@/app/config/pagination";
import {
  expenseCategoryLabel,
  EXPENSE_CATEGORIES,
  PAYMENT_MODES,
} from "@/app/utilsComponents/expenseConstants";
import { formatDate } from "@/app/utilsComponents/DateFormat";

const MODE_COLORS: Record<string, string> = {
  cash: "bg-green-100 text-green-700",
  cheque: "bg-blue-100 text-blue-700",
  bank_transfer: "bg-purple-100 text-purple-700",
  bank: "bg-purple-100 text-purple-700",
  upi: "bg-orange-100 text-orange-700",
  card: "bg-indigo-100 text-indigo-700",
  other: "bg-gray-100 text-gray-600",
};

const inputClass =
  "h-9 border rounded-md px-3 text-sm outline-none focus:ring-2 focus:ring-black";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

export default function ExpenseListPage() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useExpenses({
    category: category || undefined,
    paymentMode: paymentMode || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const rows = Array.isArray(data?.data) ? data.data : [];
  const total = data?.total ?? rows.length;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const handleFilter =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
      setPage(1);
    };

  const handleClear = () => {
    setCategory("");
    setPaymentMode("");
    setDateFrom("");
    setDateTo("");
    setSearch("");
    setPage(1);
  };

  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load expenses.</p>
        </div>
      </BackPanel>
    );
  }

  return (
    <BackPanel>
      <div className="space-y-6 p-6">
        <PageHeader
          title="Expense Entry"
          description="Record and manage business expenses for the current financial year"
          actionLabel="New Expense"
          onAction={() => router.push("/expense/add")}
          btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
        />

        <ListFilterBar
          align="end"
          trailing={
            <ReportExport
              variant="inline"
              reportType="expenses"
              params={{ category, paymentMode, dateFrom, dateTo, search }}
            />
          }
        >
          <div className="flex min-w-[160px] flex-1 flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Search</label>
            <input
              placeholder="Expense no / title"
              value={search}
              onChange={handleFilter(setSearch)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">From</label>
            <input type="date" value={dateFrom} onChange={handleFilter(setDateFrom)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">To</label>
            <input type="date" value={dateTo} onChange={handleFilter(setDateTo)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Category</label>
            <select value={category} onChange={handleFilter(setCategory)} className={`${inputClass} min-w-[160px]`}>
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Mode</label>
            <select value={paymentMode} onChange={handleFilter(setPaymentMode)} className={inputClass}>
              <option value="">All Modes</option>
              {PAYMENT_MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="pb-2 text-xs text-gray-500 underline hover:text-gray-800"
          >
            Clear filters
          </button>
        </ListFilterBar>

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[900px] table-fixed text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="w-12 whitespace-nowrap px-5 py-3 text-left font-semibold">#</th>
                <th className="w-36 whitespace-nowrap px-5 py-3 text-left font-semibold">Expense No</th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-left font-semibold">Date</th>
                <th className="w-32 whitespace-nowrap px-5 py-3 text-left font-semibold">Category</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Title</th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-left font-semibold">Mode</th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row, i) => (
                  <tr
                    key={row._id}
                    onClick={() => router.push(`/expense/${row._id}`)}
                    className="cursor-pointer border-t transition hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-gray-400">
                      {listRowNumber(page, i)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium">{row.expenseNo}</td>
                    <td className="whitespace-nowrap px-5 py-4">{formatDate(row.date)}</td>
                    <td className="whitespace-nowrap px-5 py-4">{expenseCategoryLabel(row.category)}</td>
                    <td className="truncate px-5 py-4">{row.title}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          MODE_COLORS[row.paymentMode] || MODE_COLORS.other
                        }`}
                      >
                        {row.paymentMode.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right font-semibold">
                      {fmt(row.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    No expenses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t p-4 text-sm">
            <p className="text-gray-500">
              Showing {rows.length} of {total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="rounded-md border px-3 py-1 hover:bg-gray-50 disabled:opacity-40"
              >
                Prev
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`rounded-md border px-3 py-1 ${
                    page === i + 1 ? "bg-black text-white" : "hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data?.hasNext}
                className="rounded-md border px-3 py-1 hover:bg-gray-50 disabled:opacity-40"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BackPanel>
  );
}
