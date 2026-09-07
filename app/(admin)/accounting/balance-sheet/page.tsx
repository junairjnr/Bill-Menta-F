"use client";

import { useBalanceSheet } from "@/app/hooks/accountingHook/useAccounting";
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

export default function BalanceSheetPage() {
  const { data, isLoading, isError } = useBalanceSheet();

  return (
    <ReportShell
      title="Balance Sheet"
      description="Assets, liabilities, and equity as of today"
      exportType="balance-sheet"
      summary={
        data
          ? [
              { label: "Total Assets", value: fmtMoney(data.totalAssets) },
              { label: "Liabilities + Equity", value: fmtMoney(data.totalLiabilitiesAndEquity), highlight: true },
            ]
          : undefined
      }
      summaryLoading={isLoading}
    >
      <SectionTable title="Assets" rows={data?.assets ?? []} total={data?.totalAssets ?? 0} loading={isLoading} error={isError} />
      <SectionTable title="Liabilities" rows={data?.liabilities ?? []} total={data?.totalLiabilities ?? 0} loading={isLoading} error={isError} />
      <SectionTable title="Equity" rows={data?.equity ?? []} total={data?.totalEquity ?? 0} loading={isLoading} error={isError} />
      {data && (
        <div className="flex flex-wrap justify-end gap-6 border-t bg-gray-50 px-4 py-3 text-sm">
          <span>Retained Earnings: {fmtMoney(data.retainedEarnings)}</span>
          <span className="font-semibold">Liabilities + Equity: {fmtMoney(data.totalLiabilitiesAndEquity)}</span>
        </div>
      )}
    </ReportShell>
  );
}
