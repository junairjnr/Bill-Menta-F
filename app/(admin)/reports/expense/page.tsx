"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useExpenseReport } from "@/app/hooks/reportHooks/useReports";
import { countActiveFilters } from "@/app/utilsComponents/reportFilterUtils";
import { expenseCategoryLabel, EXPENSE_CATEGORIES } from "@/app/utilsComponents/expenseConstants";
import { REPORT_PAGE_SIZE, reportRowNumber } from "@/app/config/pagination";
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

const COLS = ["#", "Date", "Expense No", "Category", "Title", "Amount", "Mode"].map((l, i) => ({
  label: l,
  align: i === 5 ? ("right" as const) : ("left" as const),
}));

const COL_COUNT = COLS.length;

export default function ExpenseReportPage() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useExpenseReport({
    category: category || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: REPORT_PAGE_SIZE,
  });

  const rows = data?.rows ?? [];
  const activeFilterCount = countActiveFilters({ category, dateFrom, dateTo });

  const resetPage = () => setPage(1);
  const clear = () => {
    setCategory("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return (
    <ReportShell
      title="Expense Report"
      description="All expenses for the current financial year"
      onClear={clear}
      activeFilterCount={activeFilterCount}
      exportType="expense-report"
      exportParams={{ category, dateFrom, dateTo }}
      summaryLoading={isFetching && !isLoading}
      summary={[
        { label: "Total Expenses", value: fmtMoney(data?.summary?.totalAmount ?? 0), highlight: true },
        { label: "Entries", value: data?.summary?.count ?? 0 },
      ]}
      filters={
        <>
          <FilterField label="Category">
            <FilterSelect
              value={category}
              placeholder="All categories"
              options={EXPENSE_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
              onChange={(v) => {
                setCategory(v);
                resetPage();
              }}
            />
          </FilterField>
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
          <TableState colSpan={COL_COUNT} empty message="No expenses found" />
        ) : (
          rows.map((row, index) => (
            <tr
              key={row._id}
              className={reportRowClass(index, "cursor-pointer")}
              onClick={() => router.push(`/expense/${row._id}`)}
            >
              <td className="px-4 py-3 text-gray-400">{reportRowNumber(page, index)}</td>
              <td className="px-4 py-3">{fmtDate(row.date)}</td>
              <td className="px-4 py-3 font-medium">{row.expenseNo}</td>
              <td className="px-4 py-3">{expenseCategoryLabel(row.category)}</td>
              <td className="px-4 py-3">{row.title}</td>
              <td className="px-4 py-3 text-right font-medium">{fmtMoney(row.amount)}</td>
              <td className="px-4 py-3 capitalize">{row.paymentMode.replace(/_/g, " ")}</td>
            </tr>
          ))
        )}
      </ReportTable>
    </ReportShell>
  );
}
