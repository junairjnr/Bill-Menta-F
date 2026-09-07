"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import PageHeader from "@/app/utilsComponents/PageHeader";
import ReportExport from "@/app/utilsComponents/ReportExport";
import { ListFilterBar } from "@/app/utilsComponents/report-ui";
import { Button } from "@/components/ui/button";
import { useJournals } from "@/app/hooks/accountingHook/useAccounting";
import { formatDate } from "@/app/utilsComponents/DateFormat";
import { PAGE_SIZE, listRowNumber } from "@/app/config/pagination";

const inputClass =
  "h-9 border rounded-md px-3 text-sm outline-none focus:ring-2 focus:ring-black";

const JOURNAL_SOURCE_FILTER: Record<string, string> = {
  sales_invoice: "SalesInvoice",
  purchase_invoice: "PurchaseInvoice",
  receipt: "ReceiptPayment",
  vendor_payment: "ReceiptPayment",
  expense: "Expense",
  manual: "Manual",
};

const journalSourceLabel = (referenceType?: string) => {
  if (!referenceType) return "—";
  if (referenceType === "ReceiptPayment") return "Receipt / Payment";
  return referenceType.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n || 0);

export default function JournalEntriesPage() {
  const router = useRouter();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [referenceType, setReferenceType] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useJournals({
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    referenceType: referenceType
      ? JOURNAL_SOURCE_FILTER[referenceType] ?? referenceType
      : undefined,
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
          <p className="text-sm text-red-400">Failed to load journal entries.</p>
        </div>
      </BackPanel>
    );
  }

  return (
    <BackPanel>
      <div className="space-y-6 p-6">
        <PageHeader
          title="Journal Entries"
          description="Double-entry journals posted from invoices, receipts, payments, and expenses"
          actionLabel="Manual Journal"
          onAction={() => router.push("/accounting/manual-journal/add")}
          btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
        />

        <ListFilterBar
          align="end"
          trailing={
            <ReportExport
              variant="inline"
              reportType="journals"
              params={{ dateFrom, dateTo, referenceType }}
            />
          }
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">From</label>
            <input type="date" value={dateFrom} onChange={handleFilter(setDateFrom)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">To</label>
            <input type="date" value={dateTo} onChange={handleFilter(setDateTo)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Source</label>
            <select value={referenceType} onChange={handleFilter(setReferenceType)} className={`${inputClass} min-w-[160px]`}>
              <option value="">All Sources</option>
              <option value="sales_invoice">Sales Invoice</option>
              <option value="purchase_invoice">Purchase Invoice</option>
              <option value="receipt">Receipt</option>
              <option value="vendor_payment">Vendor Payment</option>
              <option value="expense">Expense</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              setDateFrom("");
              setDateTo("");
              setReferenceType("");
              setPage(1);
            }}
            className="pb-2 text-xs text-gray-500 underline hover:text-gray-800"
          >
            Clear filters
          </button>
        </ListFilterBar>

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[900px] table-fixed text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="w-12 px-5 py-3 text-left font-semibold">#</th>
                <th className="w-36 px-5 py-3 text-left font-semibold">Journal No</th>
                <th className="w-28 px-5 py-3 text-left font-semibold">Date</th>
                <th className="w-32 px-5 py-3 text-left font-semibold">Source</th>
                <th className="px-5 py-3 text-left font-semibold">Reference</th>
                <th className="w-28 px-5 py-3 text-right font-semibold">Debit</th>
                <th className="w-28 px-5 py-3 text-right font-semibold">Credit</th>
                <th className="w-24 px-5 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row, i) => (
                  <tr
                    key={row._id}
                    onClick={() => router.push(`/accounting/entries/${row._id}`)}
                    className="cursor-pointer border-t transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 text-gray-400">{listRowNumber(page, i)}</td>
                    <td className="px-5 py-4 font-medium">{row.journalNo}</td>
                    <td className="px-5 py-4">{formatDate(row.entryDate)}</td>
                    <td className="px-5 py-4">{journalSourceLabel(row.referenceType)}</td>
                    <td className="truncate px-5 py-4">{row.referenceNo || "—"}</td>
                    <td className="px-5 py-4 text-right">{fmt(row.totalDebit)}</td>
                    <td className="px-5 py-4 text-right">{fmt(row.totalCredit)}</td>
                    <td className="px-5 py-4 capitalize">{row.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">
                    No journal entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t p-4 text-sm">
            <p className="text-gray-500">Showing {rows.length} of {total}</p>
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
                  className={`rounded-md border px-3 py-1 ${page === i + 1 ? "bg-black text-white" : "hover:bg-gray-50"}`}
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
