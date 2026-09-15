"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSalesReturnHistory } from "@/app/hooks/reportHooks/useReports";
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
  "Original Invoice",
  "Item",
  "Type",
  "Customer",
  "Rate",
  "Qty",
  "Taxable",
  "SGST",
  "CGST",
  "Total",
].map((l, i) => ({
  label: l,
  align: i >= 7 && i <= 12 ? ("right" as const) : ("left" as const),
}));

export default function SalesReturnHistoryPage() {
  const router = useRouter();
  const [itemId, setItemId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [salesType, setSalesType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const { data: itemData } = useItems({ limit: DROPDOWN_LIMIT });
  const { data: customerData } = useCustomers({ limit: DROPDOWN_LIMIT });
  const items = itemData?.data ?? [];
  const customers = (customerData?.data ?? []).filter(
    (c: { type?: string }) => c.type === "sales"
  );

  const { data, isLoading, isFetching } = useSalesReturnHistory({
    itemId: itemId || undefined,
    customerId: customerId || undefined,
    salesType: salesType || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: REPORT_PAGE_SIZE,
  });

  const rows = data?.rows ?? [];
  const summary = data?.summary;
  const resetPage = () => setPage(1);

  return (
    <ReportShell
      title="Sales Return History"
      description="Item-wise sales return history"
      onClear={() => {
        setItemId("");
        setCustomerId("");
        setSalesType("");
        setDateFrom("");
        setDateTo("");
        setPage(1);
      }}
      activeFilterCount={countActiveFilters({ itemId, customerId, salesType, dateFrom, dateTo })}
      exportType="sales-return-history"
      exportParams={{ itemId, customerId, salesType, dateFrom, dateTo }}
      summaryLoading={isFetching && !isLoading}
      summary={
        summary
          ? [
              { label: "Total Returns", value: summary.totalReturns },
              { label: "Retail", value: summary.retailReturns },
              { label: "Wholesale", value: summary.wholesaleReturns },
              { label: "Total Qty", value: summary.totalQty },
              { label: "Total Taxable", value: fmtMoney(summary.totalTaxable) },
              { label: "SGST", value: fmtMoney(summary.totalSGST ?? 0) },
              { label: "CGST", value: fmtMoney(summary.totalCGST ?? 0) },
              { label: "Total Value", value: fmtMoney(summary.totalValue), highlight: true },
            ]
          : undefined
      }
      filterInline={
        <FilterSelect
          value={salesType}
          placeholder="All types"
          className="w-[128px]"
          options={[
            { value: "retail", label: "Retail" },
            { value: "wholesale", label: "Wholesale" },
          ]}
          onChange={(v) => {
            setSalesType(v);
            resetPage();
          }}
        />
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
          <FilterField label="Customer" wide>
            <FilterSelect
              value={customerId}
              placeholder="All customers"
              options={customers.map((c: { _id: string; name: string }) => ({
                value: c._id,
                label: c.name,
              }))}
              onChange={(v) => {
                setCustomerId(v);
                resetPage();
              }}
            />
          </FilterField>
          <FilterField label="From">
            <FilterInput type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); resetPage(); }} />
          </FilterField>
          <FilterField label="To">
            <FilterInput type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); resetPage(); }} />
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
          <TableState colSpan={COLS.length} empty message="No sales return history found" />
        ) : (
          rows.map((row, i) => (
            <tr
              key={`${row.returnId}-${i}`}
              className={reportRowClass(i, "cursor-pointer")}
              onClick={() => router.push(`/sales/salesReturn/${row.returnId}`)}
            >
              <td className="px-4 py-3 text-gray-400">{reportRowNumber(page, i)}</td>
              <td className="px-4 py-3 font-medium text-blue-600">{row.returnNo}</td>
              <td className="px-4 py-3 text-gray-600">{fmtDate(row.returnDate)}</td>
              <td className="px-4 py-3 text-gray-500">{row.originalInvoiceNo}</td>
              <td className="px-4 py-3">{row.itemName || "—"}</td>
              <td className="px-4 py-3"><StatusBadge status={row.salesType} /></td>
              <td className="px-4 py-3">{row.customer?.name || "—"}</td>
              <td className="px-4 py-3 text-right">{fmtMoney(row.rate)}</td>
              <td className="px-4 py-3 text-right font-medium">{row.qty}</td>
              <td className="px-4 py-3 text-right">{fmtMoney(row.taxableValue)}</td>
              <td className="px-4 py-3 text-right">{fmtMoney(row.sgst)}</td>
              <td className="px-4 py-3 text-right">{fmtMoney(row.cgst)}</td>
              <td className="px-4 py-3 text-right font-semibold">{fmtMoney(row.total)}</td>
            </tr>
          ))
        )}
      </ReportTable>
    </ReportShell>
  );
}
