"use client";

import { useMemo, useState } from "react";
import { useStockReport } from "@/app/hooks/reportHooks/useReports";
import type { StockReportRow } from "@/app/types";
import { useWarehouses } from "@/app/hooks/warehouseHooks/useWarehouse";
import { useItemCategories } from "@/app/hooks/masterHooks/itemCategoryHook/useItemCategory";
import { useItems } from "@/app/hooks/masterHooks/itemHook/useItem";
import { countActiveFilters } from "@/app/utilsComponents/reportFilterUtils";
import { REPORT_PAGE_SIZE, DROPDOWN_LIMIT, LOOKUP_LIMIT, reportRowNumber } from "@/app/config/pagination";
import {
  FilterField,
  ReportShell,
  ReportTable,
  ReportPagination,
  TableState,
  ReportError,
  fmtMoney,
  reportRowClass,
  FilterSelect,
  FilterCheckbox,
} from "@/app/utilsComponents/report-ui";

const COLS = [
  "#",
  "Item",
  "Code",
  "HSN CODE",
  "Category",
  "UOM",
  "Warehouse",
  "Qty",
  "Rate",
  "SGST",
  "CGST",
  "Stock Value",
].map((l, i) => ({
  label: l,
  align: i >= 7 ? ("right" as const) : ("left" as const),
}));

const COL_COUNT = COLS.length;
const rowValue = (row: StockReportRow) =>
  row.totalValue ??
  (row.stockValue ?? row.qty * (row.rate ?? row.avgCost ?? 0)) +
    (row.sgst ?? 0) +
    (row.cgst ?? 0);

export default function StockReportPage() {
  const [warehouseId, setWarehouseId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [itemId, setItemId] = useState("");
  const [includeZero, setIncludeZero] = useState(false);
  const [page, setPage] = useState(1);

  const { data: wh } = useWarehouses();
  const { data: cat } = useItemCategories({ limit: LOOKUP_LIMIT });
  const { data: itm } = useItems({ limit: DROPDOWN_LIMIT });
  const { data, isLoading, isFetching, isError, error } = useStockReport({
    warehouseId: warehouseId || undefined,
    categoryId: categoryId || undefined,
    itemId: itemId || undefined,
    includeZero,
    page,
    limit: REPORT_PAGE_SIZE,
  });

  const rows = data?.data ?? [];
  const summary = data?.summary;
  const pageTotals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          const taxable = row.stockValue ?? row.qty * (row.rate ?? row.avgCost ?? 0);
          const sgst = row.sgst ?? 0;
          const cgst = row.cgst ?? 0;
          return {
            qty: acc.qty + (row.qty ?? 0),
            taxable: acc.taxable + taxable,
            sgst: acc.sgst + sgst,
            cgst: acc.cgst + cgst,
            value: acc.value + (row.totalValue ?? taxable + sgst + cgst),
          };
        },
        { qty: 0, taxable: 0, sgst: 0, cgst: 0, value: 0 }
      ),
    [rows]
  );
  const resetPage = () => setPage(1);
  const activeFilterCount = countActiveFilters({
    warehouseId,
    categoryId,
    itemId,
    includeZero,
  });

  const clear = () => {
    setWarehouseId("");
    setCategoryId("");
    setItemId("");
    setIncludeZero(false);
    setPage(1);
  };

  const warehouseOptions = (wh?.data ?? []).map((w) => ({
    value: w._id,
    label: w.name,
  }));
  const categoryOptions = (cat?.data ?? []).map((c) => ({
    value: c._id,
    label: c.name,
  }));
  const itemOptions = (itm?.data ?? []).map((i) => ({
    value: i._id,
    label: i.name,
  }));

  return (
    <ReportShell
      title="Stock Report"
      description="Current stock levels per item per warehouse"
      onClear={clear}
      activeFilterCount={activeFilterCount}
      exportType="stock-report"
      exportParams={{ warehouseId, categoryId, itemId, includeZero: includeZero ? "true" : "false" }}
      summaryLoading={isFetching && !isLoading}
      summary={
        summary || rows.length > 0
          ? [
              {
                label: "Total Items",
                value: summary?.totalItems ?? rows.length,
              },
              {
                label: "Total Stock",
                value: summary?.totalQty ?? pageTotals.qty,
              },
              { label: "Taxable Value", value: fmtMoney(summary?.totalTaxable ?? pageTotals.taxable) },
              { label: "SGST", value: fmtMoney(summary?.totalSGST ?? pageTotals.sgst) },
              { label: "CGST", value: fmtMoney(summary?.totalCGST ?? pageTotals.cgst) },
              {
                label: "Total Value",
                value: fmtMoney(summary?.totalStockValue ?? pageTotals.value),
                highlight: true,
              },
            ]
          : undefined
      }
      filterInline={
        <>
          <FilterSelect
            value={warehouseId}
            placeholder="All warehouses"
            className="w-[140px]"
            options={warehouseOptions}
            onChange={(v) => {
              setWarehouseId(v);
              resetPage();
            }}
          />
          <FilterSelect
            value={categoryId}
            placeholder="All categories"
            className="w-[140px]"
            options={categoryOptions}
            onChange={(v) => {
              setCategoryId(v);
              resetPage();
            }}
          />
        </>
      }
      filters={
        <>
          <FilterField label="Category">
            <FilterSelect
              placeholder="All categories"
              value={categoryId}
              options={categoryOptions}
              onChange={(v) => {
                setCategoryId(v);
                resetPage();
              }}
            />
          </FilterField>
          <FilterField label="Item" wide>
            <FilterSelect
              placeholder="All items"
              value={itemId}
              options={itemOptions}
              onChange={(v) => {
                setItemId(v);
                resetPage();
              }}
            />
          </FilterField>
          <FilterField label="Options">
            <FilterCheckbox
              label="Include zero stock"
              checked={includeZero}
              onChange={(v) => {
                setIncludeZero(v);
                resetPage();
              }}
            />
          </FilterField>
        </>
      }
    >
      {isError && (
        <ReportError
          message={
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message
          }
        />
      )}
      <ReportTable
        columns={COLS}
        footer={
          !isLoading && !isError && (data?.total ?? 0) > 0 ? (
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
        ) : isError ? (
          <TableState colSpan={COL_COUNT} error message="Could not load stock report" />
        ) : rows.length === 0 ? (
          <TableState colSpan={COL_COUNT} empty message="No stock data found" />
        ) : (
          rows.map((row, i) => {
            const item = row.itemId as {
              name?: string;
              code?: string;
              hsnCode?: string;
              categoryId?: { name?: string };
              uomId?: { shortCode?: string };
            };
            const uom = (row.uomId ?? item?.uomId) as
              | { shortCode?: string }
              | undefined;
            const warehouse = row.warehouseId as { name?: string };
            return (
              <tr key={row._id} className={reportRowClass(i)}>
                <td className="px-4 py-3 text-gray-400">
                  {reportRowNumber(page, i)}
                </td>
                <td className="px-4 py-3 font-medium">{item?.name ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500">{item?.code ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500">
                  {item?.hsnCode ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {item?.categoryId?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {uom?.shortCode ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {warehouse?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-right font-medium">{row.qty}</td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {fmtMoney(row.rate ?? row.avgCost)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {fmtMoney(row.sgst ?? 0)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {fmtMoney(row.cgst ?? 0)}
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {fmtMoney(rowValue(row))}
                </td>
              </tr>
            );
          })
        )}
        {!isLoading && !isError && rows.length > 0 && (
          <tr className="border-t-2 border-gray-200 bg-gray-50 font-semibold">
            <td colSpan={7} className="px-4 py-3 text-right text-gray-700">
              Page Total
            </td>
            <td className="px-4 py-3 text-right">{pageTotals.qty}</td>
            <td className="px-4 py-3" />
            <td className="px-4 py-3 text-right">{fmtMoney(pageTotals.sgst)}</td>
            <td className="px-4 py-3 text-right">{fmtMoney(pageTotals.cgst)}</td>
            <td className="px-4 py-3 text-right">{fmtMoney(pageTotals.value)}</td>
          </tr>
        )}
      </ReportTable>
    </ReportShell>
  );
}
