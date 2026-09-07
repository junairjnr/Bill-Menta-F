"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import PageHeader from "@/app/utilsComponents/PageHeader";
import ReportExport from "@/app/utilsComponents/ReportExport";
import { ListFilterBar, fmtMoney } from "@/app/utilsComponents/report-ui";
import SummaryCard from "@/app/utilsComponents/SummaryCard";
import { Button } from "@/components/ui/button";
import { useCustomers } from "@/app/hooks/masterHooks/customerHook/useCustomer";
import { usePayments } from "@/app/hooks/masterHooks/paymentHook/usePayment";
import { formatDate } from "@/app/utilsComponents/DateFormat";
import { resolvePartyName } from "@/app/utilsComponents/paymentConstants";
import { PAGE_SIZE, DROPDOWN_LIMIT, listRowNumber } from "@/app/config/pagination";

const MODE_LABELS: Record<string, string> = {
  cash: "Cash",
  cheque: "Cheque",
  bank_transfer: "Bank Transfer",
  upi: "UPI",
  other: "Other",
};

const MODE_COLORS: Record<string, string> = {
  cash: "bg-green-100 text-green-700",
  cheque: "bg-blue-100 text-blue-700",
  bank_transfer: "bg-purple-100 text-purple-700",
  upi: "bg-orange-100 text-orange-700",
  other: "bg-gray-100 text-gray-600",
};

const inputClass =
  "h-9 border rounded-md px-3 text-sm outline-none focus:ring-2 focus:ring-black";

const getAllocationCount = (pay: {
  allocationCount?: number;
  allocations?: unknown[];
}) => pay.allocationCount ?? (Array.isArray(pay.allocations) ? pay.allocations.length : 0);

const getVoucherAmount = (pay: { totalAmount?: number; amount?: number }) =>
  Number(pay.totalAmount ?? pay.amount ?? 0);

export default function PaymentsListPage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const { data: customerData } = useCustomers({ limit: DROPDOWN_LIMIT });
  const customers = Array.isArray(customerData?.data)
    ? customerData.data.filter((c: any) => c.type === "sales")
    : [];

  const { data, isLoading, isError } = usePayments({
    customerId: customerId || undefined,
    paymentMode: paymentMode || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const payments = Array.isArray(data?.data) ? data.data : [];
  const total = data?.total ?? payments.length;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const handleFilter = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setter(e.target.value);
    setPage(1);
  };

  const handleClear = () => {
    setCustomerId("");
    setPaymentMode("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

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
          <p className="text-red-400 text-sm">Failed to load payments.</p>
        </div>
      </BackPanel>
    );

  return (
    <BackPanel>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Payment Receipts"
          description="Manage customer payments"
          actionLabel="New Receipt"
          onAction={() => router.push("/reciept/payments/add")}
          btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
        />

        <ListFilterBar
          align="end"
          trailing={
            <ReportExport
              variant="inline"
              reportType="receipts"
              params={{ customerId, paymentMode, dateFrom, dateTo }}
            />
          }
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={handleFilter(setDateFrom)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={handleFilter(setDateTo)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Customer</label>
            <select
              value={customerId}
              onChange={handleFilter(setCustomerId)}
              className={inputClass + " min-w-[160px]"}
            >
              <option value="">All Customers</option>
              {customers.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Mode</label>
            <select
              value={paymentMode}
              onChange={handleFilter(setPaymentMode)}
              className={inputClass}
            >
              <option value="">All Modes</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            onClick={handleClear}
            className="text-xs text-gray-500 hover:text-gray-800 underline pb-2"
          >
            Clear filters
          </button>
        </ListFilterBar>

        <SummaryCard
          loading={isLoading}
          items={[
            {
              label: "Total Receipts",
              value: data?.summary?.count ?? total,
            },
            {
              label: "Total Amount",
              value: fmtMoney(data?.summary?.totalAmount ?? 0),
              highlight: true,
            },
          ]}
        />

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <table className="w-full min-w-[900px] table-fixed text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="w-12 whitespace-nowrap px-5 py-3 text-left font-semibold">#</th>
                <th className="w-38 whitespace-nowrap px-5 py-3 text-left font-semibold">Receipt No</th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-left font-semibold">Date</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Customer</th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-left font-semibold">Mode</th>
                <th className="w-32 whitespace-nowrap px-5 py-3 text-left font-semibold">Reference</th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-right font-semibold">Amount</th>
                <th className="w-20 whitespace-nowrap px-5 py-3 text-right font-semibold">Invoices</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((pay, i) => {
                  const partyName = resolvePartyName(pay);
                  const allocationCount = getAllocationCount(pay);
                  return (
                  <tr
                    key={pay._id}
                    onClick={() => router.push(`/reciept/payments/${pay._id}`)}
                    className="border-t hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-gray-400">
                      {listRowNumber(page, i)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-blue-600">
                      {pay.voucherNo ?? (pay as { receiptNo?: string }).receiptNo}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatDate(pay.date ?? (pay as { receiptDate?: string }).receiptDate)}
                    </td>
                    <td
                      className="max-w-0 truncate whitespace-nowrap px-5 py-4 text-gray-700"
                      title={partyName}
                    >
                      {partyName}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          MODE_COLORS[pay.paymentMode] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {MODE_LABELS[pay.paymentMode] ?? pay.paymentMode}
                      </span>
                    </td>
                    <td className="truncate whitespace-nowrap px-5 py-4 text-gray-500">
                      {pay.referenceNo || "—"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-gray-800">
                      ₹ {getVoucherAmount(pay).toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right text-gray-500">
                      {allocationCount}
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    No payment receipts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 border-t text-sm">
            <p className="text-gray-500">
              Showing {payments.length} of {total}
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
