"use client";

import { useRouter } from "next/navigation";
import { useCustomerBalances } from "@/app/hooks/accountingHook/useAccounting";
import {
  ReportShell,
  ReportTable,
  TableState,
  fmtMoney,
  reportRowClass,
} from "@/app/utilsComponents/report-ui";

const COLS = [
  { label: "#" },
  { label: "Customer" },
  { label: "Phone" },
  { label: "Outstanding", align: "right" as const },
];

export default function CustomerBalancePage() {
  const router = useRouter();
  const { data = [], isLoading, isError } = useCustomerBalances();

  const totalOutstanding = data.reduce((s, r) => s + (r.balance || 0), 0);

  return (
    <ReportShell
      title="Customer Outstanding"
      description="Receivable balances from posted journal sub-ledgers"
      exportType="customer-balances"
      summary={[
        { label: "Customers", value: data.length },
        { label: "Total Outstanding", value: fmtMoney(totalOutstanding), highlight: true },
      ]}
      summaryLoading={isLoading}
    >
      <ReportTable columns={COLS}>
        {isLoading || isError || data.length === 0 ? (
          <TableState
            colSpan={4}
            loading={isLoading}
            error={isError}
            empty={!isLoading && !isError && data.length === 0}
            message={isError ? "Failed to load balances" : undefined}
          />
        ) : (
          data.map((row, i) => (
            <tr
              key={row.partyId}
              className={`${reportRowClass(i)} cursor-pointer`}
              onClick={() =>
                router.push(
                  `/accounting/sub-ledgers?partyType=customer&partyId=${row.partyId}&partyName=${encodeURIComponent(row.name)}`
                )
              }
            >
              <td className="px-4 py-3 text-gray-400">{i + 1}</td>
              <td className="px-4 py-3 font-medium">{row.name}</td>
              <td className="px-4 py-3 text-gray-600">{row.phone || "—"}</td>
              <td className="px-4 py-3 text-right font-semibold">{fmtMoney(row.balance)}</td>
            </tr>
          ))
        )}
      </ReportTable>
    </ReportShell>
  );
}
