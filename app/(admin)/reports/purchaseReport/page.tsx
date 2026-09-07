"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePurchaseReport } from "@/app/hooks/reportHooks/useReports";
import { useWarehouses } from "@/app/hooks/warehouseHooks/useWarehouse";
import { useCustomers } from "@/app/hooks/masterHooks/customerHook/useCustomer";
import { countActiveFilters } from "@/app/utilsComponents/reportFilterUtils";
import { REPORT_PAGE_SIZE, DROPDOWN_LIMIT, reportRowNumber } from "@/app/config/pagination";
import {
  FilterField, ReportShell, ReportTable, ReportPagination, TableState,
  StatusBadge, fmtDate, fmtMoney, reportRowClass,
  FilterSelect, FilterInput,
} from "@/app/utilsComponents/report-ui";

const COLS = ["#", "Invoice No", "Date", "Vendor", "Warehouse", "Net Amount", "SGST", "CGST", "Grand Total", "Status"].map((l, i) => ({
  label: l, align: i >= 5 && i <= 8 ? "right" as const : "left" as const,
}));

const STATUS_OPTIONS = [
  { value: "confirmed", label: "Confirmed" },
  { value: "draft", label: "Draft" },
  { value: "cancelled", label: "Cancelled" },
];

export default function PurchaseReportPage() {
  const router = useRouter();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data: wh } = useWarehouses();
  const { data: vendors } = useCustomers({ limit: DROPDOWN_LIMIT });
  const { data, isLoading, isFetching } = usePurchaseReport({
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    vendorId: vendorId || undefined,
    warehouseId: warehouseId || undefined,
    status: status || undefined,
    page,
    limit: REPORT_PAGE_SIZE,
  });

  const rows = data?.data ?? [];
  const activeFilterCount = countActiveFilters({
    dateFrom, dateTo, vendorId, warehouseId, status,
  });

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

  const warehouseOptions = (wh?.data ?? []).map((w) => ({ value: w._id, label: w.name }));

  return (
    <ReportShell
      title="Purchase Report"
      description="Purchase invoice summary and details"
      onClear={clear}
      activeFilterCount={activeFilterCount}
      exportType="purchase-report"
      exportParams={{ dateFrom, dateTo, vendorId, warehouseId, status }}
      summaryLoading={isFetching && !isLoading}
      summary={data?.summary ? [
        { label: "Invoices", value: data.summary.totalInvoices },
        { label: "Net Amount", value: fmtMoney(data.summary.totalNetAmount) },
        { label: "SGST", value: fmtMoney(data.summary.totalSGST) },
        { label: "CGST", value: fmtMoney(data.summary.totalCGST) },
        { label: "Tax", value: fmtMoney(data.summary.totalTax) },
        { label: "Grand Total", value: fmtMoney(data.summary.grandTotal), highlight: true },
      ] : undefined}
      filterInline={
        <FilterSelect
          value={status}
          placeholder="All status"
          className="w-[128px]"
          options={STATUS_OPTIONS}
          onChange={(v) => { setStatus(v); resetPage(); }}
        />
      }
      filters={<>
        <FilterField label="From date">
          <FilterInput type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); resetPage(); }} />
        </FilterField>
        <FilterField label="To date">
          <FilterInput type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); resetPage(); }} />
        </FilterField>
        <FilterField label="Vendor" wide>
          <FilterSelect
            placeholder="All vendors"
            value={vendorId}
            options={vendorOptions}
            onChange={(v) => { setVendorId(v); resetPage(); }}
          />
        </FilterField>
        <FilterField label="Warehouse">
          <FilterSelect
            placeholder="All warehouses"
            value={warehouseId}
            options={warehouseOptions}
            onChange={(v) => { setWarehouseId(v); resetPage(); }}
          />
        </FilterField>
      </>}
    >
      <ReportTable
        columns={COLS}
        footer={!isLoading && (data?.total ?? 0) > 0 ? (
          <ReportPagination
            page={page}
            totalPages={data?.totalPages ?? 1}
            total={data?.total ?? 0}
            count={rows.length}
            hasNext={data?.hasNext}
            onPage={setPage}
          />
        ) : undefined}
      >
        {isLoading ? <TableState colSpan={10} loading /> :
          rows.length === 0 ? <TableState colSpan={10} empty message="No purchase invoices found" /> :
          rows.map((inv, i) => (
            <tr
              key={inv._id}
              onClick={() => router.push(`/purchase/purchaseInvoice/${inv._id}`)}
              className={reportRowClass(i, "cursor-pointer")}
            >
              <td className="px-4 py-3 text-gray-400">{reportRowNumber(page, i)}</td>
              <td className="px-4 py-3 font-medium text-blue-600">{inv.invoiceNo}</td>
              <td className="px-4 py-3 text-gray-600">{fmtDate(inv.purchaseDate)}</td>
              <td className="px-4 py-3">{typeof inv.vendorId === "object" ? inv.vendorId.name : inv.vendorSnapshot?.name}</td>
              <td className="px-4 py-3 text-gray-500">{typeof inv.warehouseId === "object" ? inv.warehouseId.name : "—"}</td>
              <td className="px-4 py-3 text-right">{fmtMoney(inv.netAmount)}</td>
              <td className="px-4 py-3 text-right text-gray-600">{fmtMoney(inv.totalSGST)}</td>
              <td className="px-4 py-3 text-right text-gray-600">{fmtMoney(inv.totalCGST)}</td>
              <td className="px-4 py-3 text-right font-semibold">{fmtMoney(inv.grandTotal)}</td>
              <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
            </tr>
          ))}
      </ReportTable>
    </ReportShell>
  );
}
