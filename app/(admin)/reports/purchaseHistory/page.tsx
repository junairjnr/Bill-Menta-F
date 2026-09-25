"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePurchaseHistory } from "@/app/hooks/reportHooks/useReports";
import { useItems } from "@/app/hooks/masterHooks/itemHook/useItem";
import { useCustomers } from "@/app/hooks/masterHooks/customerHook/useCustomer";
import { countActiveFilters } from "@/app/utilsComponents/reportFilterUtils";
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

const COLS = [
  "#",
  "Invoice No",
  "Date",
  "Item",
  "HSN",
  "Vendor",
  "Warehouse",
  "Qty",
  "Rate",
  "Taxable Value",
  "SGST",
  "CGST",
  "Total",
].map((l, i) => ({
  label: l,
  align: i >= 7 && i <= 12 ? ("right" as const) : ("left" as const),
}));

const COL_COUNT = COLS.length;

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const [itemId, setItemId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const { data: itemData } = useItems({ limit: DROPDOWN_LIMIT });
  const { data: customerData } = useCustomers({ limit: DROPDOWN_LIMIT });

  const items = itemData?.data ?? [];
  const vendors = (customerData?.data ?? []).filter(
    (c: { type?: string }) => c.type === "purchase"
  );

  const { data, isLoading, isFetching } = usePurchaseHistory({
    itemId: itemId || undefined,
    vendorId: vendorId || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: REPORT_PAGE_SIZE,
  });

  const rows = data?.rows ?? [];
  const summary = data?.summary;

  const activeFilterCount = countActiveFilters({
    itemId,
    vendorId,
    dateFrom,
    dateTo,
  });

  const resetPage = () => setPage(1);
  const clear = () => {
    setItemId("");
    setVendorId("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return (
    <ReportShell
      title="Purchase History"
      description="Item-wise purchase history — track rate and quantity trends"
      onClear={clear}
      activeFilterCount={activeFilterCount}
      exportType="purchase-history"
      exportParams={{ itemId, vendorId, dateFrom, dateTo }}
      summaryLoading={isFetching && !isLoading}
      summary={
        summary
          ? [
              { label: "Total Bills", value: summary.totalBills },
              { label: "Total Qty", value: summary.totalQty },
              { label: "Total Taxable", value: fmtMoney(summary.totalTaxable) },
              { label: "SGST", value: fmtMoney(summary.totalSGST ?? 0) },
              { label: "CGST", value: fmtMoney(summary.totalCGST ?? 0) },
              { label: "Avg Rate", value: fmtMoney(summary.avgRate) },
              {
                label: "Total Value",
                value: fmtMoney(summary.totalValue),
                highlight: true,
              },
            ]
          : undefined
      }
      filters={
        <>
          <FilterField label="Item" wide>
            <FilterSelect
              value={itemId}
              placeholder="All items"
              options={items.map((i: { _id: string; name: string }) => ({
                value: i._id,
                label: i.name,
              }))}
              onChange={(v) => {
                setItemId(v);
                resetPage();
              }}
            />
          </FilterField>
          <FilterField label="Vendor" wide>
            <FilterSelect
              value={vendorId}
              placeholder="All vendors"
              options={vendors.map((v: { _id: string; name: string }) => ({
                value: v._id,
                label: v.name,
              }))}
              onChange={(v) => {
                setVendorId(v);
                resetPage();
              }}
            />
          </FilterField>
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
          <TableState colSpan={COL_COUNT} loading />
        ) : rows.length === 0 ? (
          <TableState colSpan={COL_COUNT} empty message="No purchase history found" />
        ) : (
          rows.map((row, i) => (
            <tr
              key={`${row._id}-${i}`}
              onClick={() =>
                router.push(`/purchase/purchaseInvoice/${row.invoiceId}`)
              }
              className={reportRowClass(i, "cursor-pointer")}
            >
              <td className="px-4 py-3 text-gray-400">
                {reportRowNumber(page, i)}
              </td>
              <td className="px-4 py-3 font-medium text-blue-600">
                {row.invoiceNo}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {fmtDate(row.purchaseDate)}
              </td>
              <td className="px-4 py-3 text-gray-700">{row.itemName || "—"}</td>
              <td className="px-4 py-3 text-gray-500">{row.hsn || "—"}</td>
              <td className="px-4 py-3">{row.vendor?.name || "—"}</td>
              <td className="px-4 py-3 text-gray-500">
                {(row.warehouse as { name?: string })?.name || "—"}
              </td>
              <td className="px-4 py-3 text-right font-medium">{row.qty}</td>
              <td className="px-4 py-3 text-right">{fmtMoney(row.rate)}</td>
              <td className="px-4 py-3 text-right">
                {fmtMoney(row.taxableValue)}
              </td>
              <td className="px-4 py-3 text-right text-gray-600">
                {fmtMoney(row.sgst)}
              </td>
              <td className="px-4 py-3 text-right text-gray-600">
                {fmtMoney(row.cgst)}
              </td>
              <td className="px-4 py-3 text-right font-semibold">
                {fmtMoney(row.total)}
              </td>
            </tr>
          ))
        )}
      </ReportTable>
    </ReportShell>
  );
}
