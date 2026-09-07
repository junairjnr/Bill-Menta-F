"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackPanel from "@/app/utilsComponents/BackPanel";
import PageHeader from "@/app/utilsComponents/PageHeader";
import ReportExport from "@/app/utilsComponents/ReportExport";
import { ListFilterBar } from "@/app/utilsComponents/report-ui";
import { useSalesInvoices } from "@/app/hooks/salesHooks/useSalesInvoice";
import { PAGE_SIZE, listRowNumber } from "@/app/config/pagination";
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
  resolveBalance,
  resolveCustomerName,
  resolvePaymentStatus,
} from "@/app/utilsComponents/paymentConstants";

export default function SalesInvoiceListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [salesType, setSalesType] = useState<"" | "retail" | "wholesale">("");

  const { data, isLoading, isError } = useSalesInvoices({
    page,
    search,
    limit: PAGE_SIZE,
    salesType: salesType || undefined,
  });

  const invoices = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCreate = () => router.push("/sales/salesInvoice/add");

  if (isLoading)
    return (
      <BackPanel>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </BackPanel>
    );

  if (isError)
    return (
      <BackPanel>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-400 text-sm">Failed to load invoices.</p>
        </div>
      </BackPanel>
    );

  return (
    <BackPanel>
      <div className="p-6 space-y-6">
        {/* ── Header ───────────────────────────────────────── */}
        <PageHeader
          title="Sales Invoices"
          description="Manage your retail and wholesale invoices"
          actionLabel="New Invoice"
          onAction={handleCreate}
          btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
        />

        <ListFilterBar
          trailing={
            <ReportExport variant="inline" reportType="sales" params={{ salesType, search }} />
          }
        >
          <div className="relative min-w-[200px] flex-1">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              placeholder="Search by invoice number..."
              value={search}
              onChange={handleSearch}
              className="h-10 w-full max-w-sm rounded-md border pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex gap-2">
            {(["", "retail", "wholesale"] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSalesType(type);
                  setPage(1);
                }}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                  salesType === type
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {type === ""
                  ? "All"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </ListFilterBar>

        {/* ── Table ────────────────────────────────────────── */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <table className="w-full min-w-[1100px] table-fixed text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="w-12 whitespace-nowrap px-5 py-3 text-left font-semibold">#</th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-left font-semibold">
                  Invoice No
                </th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-left font-semibold">Date</th>
                <th className="w-24 whitespace-nowrap px-5 py-3 text-left font-semibold">Type</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Customer</th>
                <th className="w-36 whitespace-nowrap px-5 py-3 text-left font-semibold">
                  Price Level
                </th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-right font-semibold">
                  Grand Total
                </th>
                <th className="w-24 whitespace-nowrap px-5 py-3 text-right font-semibold">Received</th>
                <th className="w-24 whitespace-nowrap px-5 py-3 text-right font-semibold">Balance</th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-left font-semibold">Payment</th>
                <th className="w-24 whitespace-nowrap px-5 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {invoices.length > 0 ? (
                invoices.map((inv, index) => {
                  const paidAmount = inv.paidAmount ?? 0;
                  const balanceAmount = resolveBalance(
                    inv.grandTotal,
                    paidAmount,
                    inv.balanceAmount
                  );
                  const paymentStatus = resolvePaymentStatus(
                    inv.grandTotal,
                    paidAmount,
                    inv.paymentStatus
                  );
                  const customerName = resolveCustomerName(inv);

                  return (
                  <tr
                    key={inv._id}
                    onClick={() => router.push(`/sales/salesInvoice/${inv._id}`)}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                  >
                    {/* Serial */}
                    <td className="px-5 py-4 text-gray-400">
                      {listRowNumber(page, index)}
                    </td>

                    {/* Invoice No */}
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {inv.invoiceNo}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-gray-600">
                      {new Date(inv.invoiceDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          inv.salesType === "retail"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {inv.salesType.charAt(0).toUpperCase() +
                          inv.salesType.slice(1)}
                      </span>
                    </td>

                    {/* Customer */}
                    <td
                      className="max-w-0 truncate whitespace-nowrap px-5 py-4 text-gray-600"
                      title={customerName}
                    >
                      {customerName}
                    </td>

                    {/* Price Level */}
                    <td className="truncate whitespace-nowrap px-5 py-4 text-gray-500">
                      {inv.priceLevelSnapshot?.name || "—"}
                      <span className="ml-1 text-xs text-gray-400">
                        ({inv.priceLevelSnapshot?.taxPercent}%)
                      </span>
                    </td>

                    {/* Grand Total */}
                    <td className="px-5 py-4 text-right font-semibold text-gray-800">
                      ₹ {inv.grandTotal.toFixed(2)}
                    </td>

                    <td className="px-5 py-4 text-right text-green-700">
                      ₹ {paidAmount.toFixed(2)}
                    </td>

                    <td className="px-5 py-4 text-right text-orange-600 font-medium">
                      ₹ {balanceAmount.toFixed(2)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${PAYMENT_STATUS_STYLES[paymentStatus]}`}
                      >
                        {PAYMENT_STATUS_LABELS[paymentStatus]}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          inv.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : inv.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {inv.status.charAt(0).toUpperCase() +
                          inv.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="text-center py-10 text-gray-400">
                    {search
                      ? `No invoices found for "${search}"`
                      : "No sales invoices yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ── Pagination ─────────────────────────────────── */}
          <div className="flex justify-between items-center p-4 border-t text-sm">
            <p className="text-gray-500">
              Showing {invoices.length} of {total} invoices
            </p>

            <div className="flex gap-2 items-center">
              <Button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-40"
              >
                Prev
              </Button>

              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-md border ${
                    page === i + 1 ? "bg-black text-white" : "hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data?.hasNext}
                className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-40"
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
