"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePurchaseReturnReport } from "@/app/hooks/reportHooks/useReports";
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
  "Return No",
  "Date",
  "Vendor",
  "Original Invoice",
  "Taxable Value",
  "SGST",
  "CGST",
  "Total",
  "Status",
].map((l, i) => ({
  label: l,
  align: i >= 5 && i <= 8 ? ("right" as const) : ("left" as const),
}));

const STATUS_OPTIONS = [
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function PurchaseReturnReportPage() {
  const router = useRouter();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data: wh } = useWarehouses();
  const { data: vendors } = useCustomers({ limit: DROPDOWN_LIMIT });
  const { data, isLoading, isFetching } = usePurchaseReturnReport({
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    vendorId: vendorId || undefined,
    warehouseId: warehouseId || undefined,
    status: status || undefined,
    page,
    limit: REPORT_PAGE_SIZE,
  });

  const rows = data?.data ?? [];
  const resetPage = () => setPage(1);
  const clear = () => {
    setDateFrom("");
    setDateTo("");
    setVendorId("");
    setWarehouseId("");
    setStatus("");
    setPage(1);
  };

  const vendorOptions = (vendors?.data ?? [])
    .filter((c) => c.type === "purchase")
    .map((v) => ({ value: v._id, label: v.name }));

  const warehouseOptions = (wh?.data ?? []).map((w) => ({
    value: w._id,
    label: w.name,
  }));

  return (
    <ReportShell
      title="Purchase Return Report"
      description="Purchase return summary and details"
      onClear={clear}
      activeFilterCount={countActiveFilters({ dateFrom, dateTo, vendorId, warehouseId, status })}
      exportType="purchase-return-report"
      exportParams={{ dateFrom, dateTo, vendorId, warehouseId, status }}
      summaryLoading={isFetching && !isLoading}
      summary={
        data?.summary
          ? [
              { label: "Returns", value: data.summary.totalReturns },
              { label: "Taxable Value", value: fmtMoney(data.summary.totalNetAmount) },
              { label: "SGST", value: fmtMoney(data.summary.totalSGST) },
              { label: "CGST", value: fmtMoney(data.summary.totalCGST) },
              { label: "Total Value", value: fmtMoney(data.summary.grandTotal), highlight: true },
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
          <FilterField label="Vendor" wide>
            <FilterSelect
              placeholder="All vendors"
              value={vendorId}
              options={vendorOptions}
              onChange={(v) => {
                setVendorId(v);
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
          <TableState colSpan={COLS.length} loading />
        ) : rows.length === 0 ? (
          <TableState colSpan={COLS.length} empty message="No purchase returns found" />
        ) : (
          rows.map((row, i) => (
            <tr
              key={row._id}
              onClick={() => router.push(`/purchase/purchaseReturn/${row._id}`)}
              className={reportRowClass(i, "cursor-pointer")}
            >
              <td className="px-4 py-3 text-gray-400">{reportRowNumber(page, i)}</td>
              <td className="px-4 py-3 font-medium text-blue-600">{row.returnNo}</td>
              <td className="px-4 py-3 text-gray-600">{fmtDate(row.returnDate)}</td>
              <td className="px-4 py-3">
                {typeof row.vendorId === "object"
                  ? row.vendorId.name
                  : row.vendorSnapshot?.name}
              </td>
              <td className="px-4 py-3 text-gray-500">{row.originalInvoiceNo || "—"}</td>
              <td className="px-4 py-3 text-right">{fmtMoney(row.netAmount)}</td>
              <td className="px-4 py-3 text-right text-gray-600">{fmtMoney(row.totalSGST)}</td>
              <td className="px-4 py-3 text-right text-gray-600">{fmtMoney(row.totalCGST)}</td>
              <td className="px-4 py-3 text-right font-semibold">{fmtMoney(row.grandTotal)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={row.status} />
              </td>
            </tr>
          ))
        )}
      </ReportTable>
    </ReportShell>
  );
}
