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
import { useVouchers } from "@/app/hooks/masterHooks/paymentHook/usePayment";
import { formatDate } from "@/app/utilsComponents/DateFormat";
import { PAYMENT_MODE_LABELS, resolvePartyName } from "@/app/utilsComponents/paymentConstants";
import { PAGE_SIZE, DROPDOWN_LIMIT, listRowNumber } from "@/app/config/pagination";

const MODE_COLORS: Record<string, string> = {
  cash: "bg-green-100 text-green-700",
  cheque: "bg-blue-100 text-blue-700",
  bank_transfer: "bg-purple-100 text-purple-700",
  bank: "bg-purple-100 text-purple-700",
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

export default function VendorPaymentListPage() {
  const router = useRouter();
  const [vendorId, setVendorId] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const { data: customerData } = useCustomers({ limit: DROPDOWN_LIMIT });
  const vendors = Array.isArray(customerData?.data)
    ? customerData.data.filter((c: any) => c.type === "purchase")
    : [];

  const { data, isLoading, isError } = useVouchers("payment", {
    vendorId: vendorId || undefined,
    paymentMode: paymentMode || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const vouchers = Array.isArray(data?.data) ? data.data : [];
  const total = data?.total ?? vouchers.length;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const handleFilter =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
      setPage(1);
    };

  const handleClear = () => {
    setVendorId("");
    setPaymentMode("");
    setDateFrom("");
    setDateTo("");
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
          <p className="text-sm text-red-400">Failed to load payment vouchers.</p>
        </div>
      </BackPanel>
    );
  }

  return (
    <BackPanel>
      <div className="space-y-6 p-6">
        <PageHeader
          title="Payment Vouchers"
          description="Vendor payments against purchase invoices"
          actionLabel="New Payment"
          onAction={() => router.push("/payment/vendor-payments/add")}
          btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
        />

        <ListFilterBar
          align="end"
          trailing={
            <ReportExport
              variant="inline"
              reportType="payments"
              params={{ vendorId, paymentMode, dateFrom, dateTo }}
            />
          }
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={handleFilter(setDateFrom)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={handleFilter(setDateTo)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Vendor</label>
            <select
              value={vendorId}
              onChange={handleFilter(setVendorId)}
              className={`${inputClass} min-w-[160px]`}
            >
              <option value="">All Vendors</option>
              {vendors.map((v: any) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Mode</label>
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
            type="button"
            onClick={handleClear}
            className="pb-2 text-xs text-gray-500 underline hover:text-gray-800"
          >
            Clear filters
          </button>
        </ListFilterBar>

        <SummaryCard
          loading={isLoading}
          items={[
            {
              label: "Total Payments",
              value: data?.summary?.count ?? total,
            },
            {
              label: "Total Amount",
              value: fmtMoney(data?.summary?.totalAmount ?? 0),
              highlight: true,
            },
          ]}
        />

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[900px] table-fixed text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="w-12 whitespace-nowrap px-5 py-3 text-left font-semibold">#</th>
                <th className="w-36 whitespace-nowrap px-5 py-3 text-left font-semibold">Voucher No</th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-left font-semibold">Date</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Vendor</th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-left font-semibold">Mode</th>
                <th className="w-32 whitespace-nowrap px-5 py-3 text-left font-semibold">Reference</th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-right font-semibold">Amount</th>
                <th className="w-20 whitespace-nowrap px-5 py-3 text-right font-semibold">Invoices</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.length > 0 ? (
                vouchers.map((v, i) => {
                  const partyName = resolvePartyName(v);
                  const allocationCount = getAllocationCount(v);
                  return (
                  <tr
                    key={v._id}
                    className="cursor-pointer border-t transition hover:bg-gray-50"
                    onClick={() => router.push(`/payment/vendor-payments/${v._id}`)}
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-gray-400">
                      {listRowNumber(page, i)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-blue-600">{v.voucherNo}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">{formatDate(v.date)}</td>
                    <td
                      className="max-w-0 truncate whitespace-nowrap px-5 py-4 text-gray-700"
                      title={partyName}
                    >
                      {partyName}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          MODE_COLORS[v.paymentMode] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {PAYMENT_MODE_LABELS[v.paymentMode] ?? v.paymentMode}
                      </span>
                    </td>
                    <td className="truncate whitespace-nowrap px-5 py-4 text-gray-500">{v.referenceNo || "—"}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-gray-800">
                      ₹ {getVoucherAmount(v).toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right text-gray-500">
                      {allocationCount}
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-400">
                    No payment vouchers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t p-4 text-sm">
            <p className="text-gray-500">
              Showing {vouchers.length} of {total}
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
