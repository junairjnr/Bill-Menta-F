"use client";

import { useProfitLoss } from "@/app/hooks/accountingHook/useAccounting";
import {
  ReportShell,
  ReportTable,
  TableState,
  fmtMoney,
  reportRowClass,
} from "@/app/utilsComponents/report-ui";

const COLS = [{ label: "Account" }, { label: "Amount", align: "right" as const }];

function SectionTable({
  title,
  rows,
  total,
  loading,
  error,
}: {
  title: string;
  rows: { accountCode: string; accountName: string; amount: number }[];
  total: number;
  loading?: boolean;
  error?: boolean;
}) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <div className="bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </div>
      <ReportTable columns={COLS}>
        {loading || error || rows.length === 0 ? (
          <TableState colSpan={2} loading={loading} error={error} empty={!loading && !error && rows.length === 0} />
        ) : (
          rows.map((row, i) => (
            <tr key={row.accountCode} className={reportRowClass(i)}>
              <td className="px-4 py-3">
                <span className="font-mono text-xs text-gray-500 mr-2">{row.accountCode}</span>
                {row.accountName}
              </td>
              <td className="px-4 py-3 text-right">{fmtMoney(row.amount)}</td>
            </tr>
          ))
        )}
      </ReportTable>
      <div className="flex justify-end border-t bg-gray-50 px-4 py-2 text-sm font-semibold">
        Total: {fmtMoney(total)}
      </div>
    </div>
  );
}

export default function ProfitLossPage() {
  const { data, isLoading, isError } = useProfitLoss();

  return (
    <ReportShell
      title="Profit & Loss"
      description="Income and expense summary for the current financial year"
      exportType="profit-loss"
      summary={
        data
          ? [
              { label: "Income", value: fmtMoney(data.totalIncome) },
              { label: "Expenses", value: fmtMoney(data.totalExpense) },
              {
                label: data.netProfit >= 0 ? "Net Profit" : "Net Loss",
                value: fmtMoney(Math.abs(data.netProfit)),
                highlight: true,
              },
            ]
          : undefined
      }
      summaryLoading={isLoading}
    >
      <SectionTable
        title="Income"
        rows={data?.income ?? []}
        total={data?.totalIncome ?? 0}
        loading={isLoading}
        error={isError}
      />
      <SectionTable
        title="Expenses"
        rows={data?.expenses ?? []}
        total={data?.totalExpense ?? 0}
        loading={isLoading}
        error={isError}
      />
    </ReportShell>
  );
}
