"use client";

import { useTrialBalance } from "@/app/hooks/accountingHook/useAccounting";
import {
  ReportShell,
  ReportTable,
  TableState,
  fmtMoney,
  reportRowClass,
} from "@/app/utilsComponents/report-ui";

const COLS = [
  { label: "Code" },
  { label: "Account" },
  { label: "Type" },
  { label: "Debit", align: "right" as const },
  { label: "Credit", align: "right" as const },
];

export default function TrialBalancePage() {
  const { data, isLoading, isError } = useTrialBalance();
  const rows = data?.rows ?? [];

  return (
    <ReportShell
      title="Trial Balance"
      description="Account balances for the current financial year"
      exportType="trial-balance"
      summary={
        data
          ? [
              { label: "Total Debit", value: fmtMoney(data.totals.totalDebit) },
              { label: "Total Credit", value: fmtMoney(data.totals.totalCredit), highlight: true },
            ]
          : undefined
      }
      summaryLoading={isLoading}
    >
      <ReportTable
        columns={COLS}
        footer={
          data ? (
            <div className="flex justify-end gap-8 border-t bg-gray-50 px-4 py-3 text-sm font-semibold">
              <span>Total Debit: {fmtMoney(data.totals.totalDebit)}</span>
              <span>Total Credit: {fmtMoney(data.totals.totalCredit)}</span>
            </div>
          ) : undefined
        }
      >
        {isLoading || isError || rows.length === 0 ? (
          <TableState
            colSpan={5}
            loading={isLoading}
            error={isError}
            empty={!isLoading && !isError && rows.length === 0}
          />
        ) : (
          rows.map((row, i) => (
            <tr key={row.accountCode} className={reportRowClass(i)}>
              <td className="px-4 py-3 font-mono text-xs">{row.accountCode}</td>
              <td className="px-4 py-3">{row.accountName}</td>
              <td className="px-4 py-3 capitalize">{row.accountType}</td>
              <td className="px-4 py-3 text-right">{row.debitBalance ? fmtMoney(row.debitBalance) : "—"}</td>
              <td className="px-4 py-3 text-right">{row.creditBalance ? fmtMoney(row.creditBalance) : "—"}</td>
            </tr>
          ))
        )}
      </ReportTable>
    </ReportShell>
  );
}
