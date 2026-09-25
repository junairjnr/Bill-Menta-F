"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useShopReport } from "@/app/hooks/reportHooks/useReports";
import { useCustomers } from "@/app/hooks/masterHooks/customerHook/useCustomer";
import { countActiveFilters } from "@/app/utilsComponents/reportFilterUtils";
import type { ShopReportEntry, ShopReportEntryType } from "@/app/types";
import { REPORT_PAGE_SIZE, DROPDOWN_LIMIT, reportRowNumber } from "@/app/config/pagination";
import {
  FilterField,
  ReportShell,
  ReportTable,
  ReportPagination,
  TableState,
  fmtDate,
  fmtMoney,
  reportRowClass,
  FilterSelect,
  FilterInput,
} from "@/app/utilsComponents/report-ui";

const TYPE_LABELS: Record<ShopReportEntryType, string> = {
  sales: "Sales Invoice",
  sales_return: "Sales Return",
  purchase: "Purchase Invoice",
  purchase_return: "Purchase Return",
  receipt: "Receipt",
  payment: "Payment",
};

const TYPE_STYLES: Record<ShopReportEntryType, string> = {
  sales: "bg-blue-100 text-blue-700",
  sales_return: "bg-orange-100 text-orange-700",
  purchase: "bg-violet-100 text-violet-700",
  purchase_return: "bg-amber-100 text-amber-700",
  receipt: "bg-green-100 text-green-700",
  payment: "bg-emerald-100 text-emerald-700",
};

const COLS = [
  "#",
  "Date",
  "Type",
  "Reference",
  "Party",
  "Debit",
  "Credit",
  "Balance",
  "Status",
].map((l, i) => ({
  label: l,
  align: i >= 5 && i <= 7 ? ("right" as const) : ("left" as const),
}));

const routeFor = (entry: ShopReportEntry) => {
  switch (entry.type) {
    case "sales":
      return `/sales/salesInvoice/${entry._id}`;
    case "sales_return":
      return `/sales/salesReturn/${entry._id}`;
    case "purchase":
      return `/purchase/purchaseInvoice/${entry._id}`;
    case "purchase_return":
      return `/purchase/purchaseReturn/${entry._id}`;
    case "receipt":
      return `/reciept/payments/${entry._id}`;
    case "payment":
      return `/payment/vendor-payments/${entry._id}`;
    default:
      return "";
  }
};

export default function ShopReportPage() {
  const router = useRouter();
  const [partyType, setPartyType] = useState("");
  const [partyId, setPartyId] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const { data: customerData } = useCustomers({ limit: DROPDOWN_LIMIT });
  const customers = (customerData?.data ?? []).filter(
    (c: { type?: string }) => c.type === "sales"
  );
  const vendors = (customerData?.data ?? []).filter(
    (c: { type?: string }) => c.type === "purchase"
  );

  const { data, isLoading, isFetching } = useShopReport({
    partyType: partyType === "customer" || partyType === "vendor" ? partyType : undefined,
    partyId: partyId || undefined,
    salesType:
      partyType === "customer" && (customerType === "retail" || customerType === "wholesale")
        ? customerType
        : undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: REPORT_PAGE_SIZE,
  });

  const rows = data?.rows ?? [];
  const summary = data?.summary;

  const activeFilterCount = countActiveFilters({
    partyType,
    partyId,
    customerType,
    dateFrom,
    dateTo,
  });

  const resetPage = () => setPage(1);
  const clear = () => {
    setPartyType("");
    setPartyId("");
    setCustomerType("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const filteredCustomers =
    partyType === "customer" && (customerType === "retail" || customerType === "wholesale")
      ? customers.filter(
          (c: { customerType?: string }) => c.customerType === customerType
        )
      : customers;

  const partyOptions =
    partyType === "vendor"
      ? vendors.map((v: { _id: string; name: string }) => ({ value: v._id, label: v.name }))
      : partyType === "customer"
        ? filteredCustomers.map((c: { _id: string; name: string; customerType?: string }) => ({
            value: c._id,
            label: `${c.name}${c.customerType ? ` (${c.customerType})` : ""}`,
          }))
        : [];

  return (
    <ReportShell
      title="Ledger Report"
      description="Party ledger — sales, purchase, returns, receipts and payments"
      onClear={clear}
      activeFilterCount={activeFilterCount}
      exportType="shop-report"
      exportParams={{ partyType, partyId, salesType: customerType, dateFrom, dateTo }}
      summaryLoading={isFetching && !isLoading}
      summary={
        summary
          ? [
              { label: "Total Debit", value: fmtMoney(summary.totalDebit) },
              { label: "Total Credit", value: fmtMoney(summary.totalCredit) },
              {
                label: "Outstanding",
                value: fmtMoney(summary.outstanding),
                highlight: true,
              },
            ]
          : undefined
      }
      filters={
        <>
          <FilterField label="Ledger Type">
            <FilterSelect
              value={partyType}
              placeholder="All"
              options={[
                { value: "customer", label: "Customer" },
                { value: "vendor", label: "Vendor" },
              ]}
              onChange={(v) => {
                setPartyType(v);
                setPartyId("");
                setCustomerType("");
                resetPage();
              }}
            />
          </FilterField>
          {partyType === "customer" && (
            <FilterField label="Customer Type">
              <FilterSelect
                value={customerType}
                placeholder="All types"
                options={[
                  { value: "retail", label: "Retail" },
                  { value: "wholesale", label: "Wholesale" },
                ]}
                onChange={(v) => {
                  setCustomerType(v);
                  setPartyId("");
                  resetPage();
                }}
              />
            </FilterField>
          )}
          {partyType && (
            <FilterField label={partyType === "vendor" ? "Vendor" : "Customer"} wide>
              <FilterSelect
                value={partyId}
                placeholder={`All ${partyType === "vendor" ? "vendors" : "customers"}`}
                options={partyOptions}
                onChange={(v) => {
                  setPartyId(v);
                  resetPage();
                }}
              />
            </FilterField>
          )}
          <FilterField label="From">
            <FilterInput
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                resetPage();
              }}
            />
          </FilterField>
          <FilterField label="To">
            <FilterInput
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                resetPage();
              }}
            />
          </FilterField>
        </>
      }
    >
      <ReportTable
        columns={COLS}
        footer={
          data && data.total > 0 ? (
            <ReportPagination
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
              count={rows.length}
              hasNext={data.hasNext}
              onPage={setPage}
            />
          ) : null
        }
      >
        {isLoading ? (
          <TableState colSpan={COLS.length} loading />
        ) : rows.length === 0 ? (
          <TableState colSpan={COLS.length} empty message="No transactions found" />
        ) : (
          rows.map((entry, i) => (
            <tr
              key={`${entry.type}-${entry._id}`}
              className={reportRowClass(i, "cursor-pointer")}
              onClick={() => {
                const path = routeFor(entry);
                if (path) router.push(path);
              }}
            >
              <td className="px-4 py-3 text-gray-400">{reportRowNumber(data!.page, i)}</td>
              <td className="px-4 py-3 text-gray-600">{fmtDate(entry.date)}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_STYLES[entry.type]}`}
                >
                  {TYPE_LABELS[entry.type]}
                  {entry.salesType ? ` (${entry.salesType})` : ""}
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-gray-700">{entry.refNo}</td>
              <td className="px-4 py-3 text-gray-600">{entry.partyName ?? "—"}</td>
              <td className="px-4 py-3 text-right font-medium text-red-600">
                {entry.debit > 0 ? fmtMoney(entry.debit) : "—"}
              </td>
              <td className="px-4 py-3 text-right font-medium text-green-600">
                {entry.credit > 0 ? fmtMoney(entry.credit) : "—"}
              </td>
              <td
                className={`px-4 py-3 text-right font-semibold ${
                  entry.balance == null
                    ? "text-gray-400"
                    : entry.balance > 0
                      ? "text-orange-600"
                      : "text-green-600"
                }`}
              >
                {entry.balance == null ? "—" : fmtMoney(entry.balance)}
              </td>
              <td className="px-4 py-3 capitalize text-gray-500">
                {entry.paymentMode?.replace("_", " ") || entry.status || "—"}
              </td>
            </tr>
          ))
        )}
      </ReportTable>
    </ReportShell>
  );
}
