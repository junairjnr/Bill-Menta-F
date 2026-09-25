"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSalesReport } from "@/app/hooks/reportHooks/useReports";
import { useWarehouses } from "@/app/hooks/warehouseHooks/useWarehouse";
import { useCustomers } from "@/app/hooks/masterHooks/customerHook/useCustomer";
import { countActiveFilters } from "@/app/utilsComponents/reportFilterUtils";
import { REPORT_PAGE_SIZE, DROPDOWN_LIMIT, reportRowNumber } from "@/app/config/pagination";
import {
  FilterField,
  ReportShell,
  ReportTable,
  ReportPagination,
  TableState,
  StatusBadge,
  fmtDate,
  fmtMoney,
  reportRowClass,
  FilterSelect,
  FilterInput,
} from "@/app/utilsComponents/report-ui";

const COLS = [
  "#",
  "Invoice No",
  "Date",
  "Type",
  "Customer",
  "Price Level",
  "Taxable Value",
  "SGST",
  "CGST",
  "Total",
  "Status",
].map((l, i) => ({
  label: l,
  align: i >= 6 && i <= 9 ? ("right" as const) : ("left" as const),
}));

const STATUS_OPTIONS = [
  { value: "confirmed", label: "Confirmed" },
  { value: "draft", label: "Draft" },
  { value: "cancelled", label: "Cancelled" },
];

export default function SalesReportPage() {
  const router = useRouter();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [salesType, setSalesType] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data: wh } = useWarehouses();
  const { data: customers } = useCustomers({ limit: DROPDOWN_LIMIT });
  const { data, isLoading, isFetching } = useSalesReport({
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    customerId: customerId || undefined,
    salesType: salesType || undefined,
    warehouseId: warehouseId || undefined,
    status: status || undefined,
    page,
    limit: REPORT_PAGE_SIZE,
  });

  const rows = data?.data ?? [];
  const activeFilterCount = countActiveFilters({
    dateFrom,
    dateTo,
    customerId,
    salesType,
    warehouseId,
    status,
  });

  const resetPage = () => setPage(1);
  const clear = () => {
    setDateFrom("");
    setDateTo("");
    setCustomerId("");
    setSalesType("");
    setWarehouseId("");
    setStatus("");
    setPage(1);
  };

  const customerOptions = (customers?.data ?? [])
    .filter((c) => c.type === "sales")
    .map((c) => ({ value: c._id, label: c.name }));

  const warehouseOptions = (wh?.data ?? []).map((w) => ({
    value: w._id,
    label: w.name,
  }));

  return (
    <ReportShell
      title="Sales Report"
      description="Sales invoice summary and details"
      onClear={clear}
      activeFilterCount={activeFilterCount}
      exportType="sales-report"
      exportParams={{ dateFrom, dateTo, customerId, salesType, warehouseId, status }}
      summaryLoading={isFetching && !isLoading}
      summary={
        data?.summary
          ? [
              { label: "Invoices", value: data.summary.totalInvoices },
              { label: "Retail", value: data.summary.retailCount },
              { label: "Wholesale", value: data.summary.wholesaleCount },
              {
                label: "Taxable Value",
                value: fmtMoney(data.summary.totalNetAmount),
              },
              { label: "SGST", value: fmtMoney(data.summary.totalSGST) },
              { label: "CGST", value: fmtMoney(data.summary.totalCGST) },
              { label: "Tax", value: fmtMoney(data.summary.totalTax) },
              {
                label: "Total Value",
                value: fmtMoney(data.summary.grandTotal),
                highlight: true,
              },
            ]
          : undefined
      }
      filterInline={
        <FilterSelect
          value={status}
          placeholder="All status"
          className="w-[128px]"
          options={STATUS_OPTIONS}
          onChange={(v) => {
            setStatus(v);
            resetPage();
          }}
        />
      }
      filters={
        <>
          <FilterField label="From date">
            <FilterInput
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                resetPage();
              }}
            />
          </FilterField>
          <FilterField label="To date">
            <FilterInput
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                resetPage();
              }}
            />
          </FilterField>
          <FilterField label="Sales type">
            <FilterSelect
              placeholder="All types"
              value={salesType}
              options={[
                { value: "retail", label: "Retail" },
                { value: "wholesale", label: "Wholesale" },
              ]}
              onChange={(v) => {
                setSalesType(v);
                resetPage();
              }}
            />
          </FilterField>
          <FilterField label="Customer" wide>
            <FilterSelect
              placeholder="All customers"
              value={customerId}
              options={customerOptions}
              onChange={(v) => {
                setCustomerId(v);
                resetPage();
              }}
            />
          </FilterField>
          <FilterField label="Warehouse">
            <FilterSelect
              placeholder="All warehouses"
              value={warehouseId}
              options={warehouseOptions}
              onChange={(v) => {
                setWarehouseId(v);
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
          !isLoading && (data?.total ?? 0) > 0 ? (
            <ReportPagination
              page={page}
              totalPages={data?.totalPages ?? 1}
              total={data?.total ?? 0}
              count={rows.length}
              hasNext={data?.hasNext}
              onPage={setPage}
            />
          ) : undefined
        }
      >
        {isLoading ? (
          <TableState colSpan={11} loading />
        ) : rows.length === 0 ? (
          <TableState colSpan={11} empty message="No sales invoices found" />
        ) : (
          rows.map((inv, i) => (
            <tr
              key={inv._id}
              onClick={() => router.push(`/sales/salesInvoice/${inv._id}`)}
              className={reportRowClass(i, "cursor-pointer")}
            >
              <td className="px-4 py-3 text-gray-400">
                {reportRowNumber(page, i)}
              </td>
              <td className="px-4 py-3 font-medium text-blue-600">
                {inv.invoiceNo}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {fmtDate(inv.invoiceDate)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={inv.salesType} />
              </td>
              <td className="px-4 py-3">
                {typeof inv.customerId === "object"
                  ? inv.customerId.name
                  : inv.customerSnapshot?.name}
              </td>
              <td className="px-4 py-3 text-gray-500">
                {inv.priceLevelSnapshot?.name
                  ? `${inv.priceLevelSnapshot.name} (${inv.priceLevelSnapshot.taxPercent}%)`
                  : "—"}
              </td>
              <td className="px-4 py-3 text-right">
                {fmtMoney(inv.netAmount)}
              </td>
              <td className="px-4 py-3 text-right text-gray-600">
                {fmtMoney(inv.totalSGST)}
              </td>
              <td className="px-4 py-3 text-right text-gray-600">
                {fmtMoney(inv.totalCGST)}
              </td>
              <td className="px-4 py-3 text-right font-semibold">
                {fmtMoney(inv.grandTotal)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={inv.status} />
              </td>
            </tr>
          ))
        )}
      </ReportTable>
    </ReportShell>
  );
}
