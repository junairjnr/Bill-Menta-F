"use client";

import { useState } from "react";
import { useLedgerReport } from "@/app/hooks/reportHooks/useReports";
import { useWarehouses } from "@/app/hooks/warehouseHooks/useWarehouse";
import { useItems } from "@/app/hooks/masterHooks/itemHook/useItem";
import { countActiveFilters } from "@/app/utilsComponents/reportFilterUtils";
import { REPORT_PAGE_SIZE, DROPDOWN_LIMIT, reportRowNumber } from "@/app/config/pagination";
import {
  FilterField, ReportShell, ReportTable, ReportPagination, TableState, ReportError,
  MOVEMENT_META, fmtDate, fmtMoney, reportRowClass,
  FilterSelect, FilterInput,
} from "@/app/utilsComponents/report-ui";

const COLS = ["#", "Date", "Movement", "Warehouse", "Reference", "Qty In", "Qty Out", "Rate", "Value", "Balance"].map((l, i) => ({
  label: l, align: i >= 5 ? "right" as const : "left" as const,
}));

const MOVEMENT_OPTIONS = Object.entries(MOVEMENT_META).map(([value, meta]) => ({
  value,
  label: meta.label,
}));

export default function LedgerReportPage() {
  const [itemId, setItemId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [movementType, setMovementType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const { data: wh } = useWarehouses();
  const { data: itm } = useItems({ limit: DROPDOWN_LIMIT });
  const { data, isLoading, isFetching, isError, error } = useLedgerReport({
    itemId,
    warehouseId: warehouseId || undefined,
    movementType: movementType || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: REPORT_PAGE_SIZE,
  });

  const rows = data?.data ?? [];
  const activeFilterCount = countActiveFilters({
    itemId, warehouseId, movementType, dateFrom, dateTo,
  });

  const resetPage = () => setPage(1);
  const clear = () => {
    setItemId("");
    setWarehouseId("");
    setMovementType("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const itemOptions = (itm?.data ?? []).map((i) => ({ value: i._id, label: i.name }));
  const warehouseOptions = (wh?.data ?? []).map((w) => ({ value: w._id, label: w.name }));

  return (
    <ReportShell
      title="Ledger Report"
      description="Stock movement history per item"
      onClear={clear}
      activeFilterCount={activeFilterCount}
      exportType="ledger-report"
      exportParams={{ itemId, warehouseId, movementType, dateFrom, dateTo }}
      summaryLoading={isFetching && !isLoading}
      summary={data?.summary && itemId ? [
        { label: "Movements", value: data.summary.totalMovements },
        { label: "Total In", value: `${data.summary.totalIn} units` },
        { label: "Total Out", value: `${data.summary.totalOut} units` },
        { label: "Total Value", value: fmtMoney(data.summary.totalValue), highlight: true },
      ] : undefined}
      filterInline={
        <FilterSelect
          value={itemId}
          placeholder="Select item"
          className="w-[160px]"
          options={itemOptions}
          onChange={(v) => { setItemId(v); resetPage(); }}
        />
      }
      filters={<>
        <FilterField label="Warehouse">
          <FilterSelect
            placeholder="All warehouses"
            value={warehouseId}
            options={warehouseOptions}
            onChange={(v) => { setWarehouseId(v); resetPage(); }}
          />
        </FilterField>
        <FilterField label="Movement" wide>
          <FilterSelect
            placeholder="All movements"
            value={movementType}
            options={MOVEMENT_OPTIONS}
            onChange={(v) => { setMovementType(v); resetPage(); }}
          />
        </FilterField>
        <FilterField label="From date">
          <FilterInput type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); resetPage(); }} />
        </FilterField>
        <FilterField label="To date">
          <FilterInput type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); resetPage(); }} />
        </FilterField>
      </>}
    >
      {!itemId && (
        <div className="border-b border-gray-100 px-4 py-8 text-center text-sm text-gray-500">
          Select an item to view its stock ledger.
        </div>
      )}
      {itemId && isError && (
        <ReportError message={(error as { response?: { data?: { message?: string } } })?.response?.data?.message} />
      )}
      {itemId && (
        <ReportTable
          columns={COLS}
          footer={!isLoading && !isError && (data?.total ?? 0) > 0 ? (
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
            isError ? <TableState colSpan={10} error message="Could not load ledger report" /> :
            rows.length === 0 ? <TableState colSpan={10} empty message="No movements found" /> :
            rows.map((row, i) => {
              const meta = MOVEMENT_META[row.movementType] ?? {
                label: row.movementType,
                color: "bg-gray-50 text-gray-600",
                dir: "in" as const,
              };
              const isIn = meta.dir === "in";
              const linked = row.linkedWarehouseId as { name?: string } | null;
              return (
                <tr key={row._id} className={reportRowClass(i)}>
                  <td className="px-4 py-3 text-gray-400">{reportRowNumber(page, i)}</td>
                  <td className="px-4 py-3 text-gray-600">{fmtDate(row.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.color}`}>
                      {meta.label}
                    </span>
                    {linked?.name && (
                      <span className="ml-1 text-xs text-gray-400">→ {linked.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{(row.warehouseId as { name?: string })?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{row.referenceNo ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-700">{isIn ? row.qty : "—"}</td>
                  <td className="px-4 py-3 text-right font-medium text-red-600">{!isIn ? row.qty : "—"}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{fmtMoney(row.rate)}</td>
                  <td className="px-4 py-3 text-right">{fmtMoney(row.value)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{row.balanceQty}</td>
                </tr>
              );
            })}
        </ReportTable>
      )}
    </ReportShell>
  );
}
