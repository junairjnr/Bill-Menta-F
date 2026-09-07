"use client";

import BackPanel from "@/app/utilsComponents/BackPanel";
import PageHeader from "@/app/utilsComponents/PageHeader";
import ReportExport from "@/app/utilsComponents/ReportExport";
import { Button } from "@/components/ui/button";
import { useChartOfAccounts, useSeedChartOfAccounts } from "@/app/hooks/accountingHook/useAccounting";

export default function ChartOfAccountsPage() {
  const { data: accounts = [], isLoading, isError } = useChartOfAccounts();
  const seedMutation = useSeedChartOfAccounts();

  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center text-sm text-gray-400">Loading...</div>
      </BackPanel>
    );
  }

  if (isError) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center text-sm text-red-400">Failed to load chart of accounts.</div>
      </BackPanel>
    );
  }

  return (
    <BackPanel>
      <div className="space-y-6 p-6">
        <PageHeader
          title="Chart of Accounts"
          description="Standard accounts used for double-entry posting"
          actionLabel={accounts.length === 0 ? "Seed Default Accounts" : undefined}
          onAction={accounts.length === 0 ? () => seedMutation.mutate() : undefined}
          btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
          actions={
            accounts.length > 0 ? (
              <ReportExport variant="inline" reportType="chart-of-accounts" />
            ) : undefined
          }
        />

        {accounts.length === 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No accounts found. Seed default accounts or log out and log in again to auto-seed.
            <div className="mt-3">
              <Button onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending}>
                {seedMutation.isPending ? "Seeding..." : "Seed Now"}
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Code</th>
                <th className="px-5 py-3 text-left font-semibold">Name</th>
                <th className="px-5 py-3 text-left font-semibold">Type</th>
                <th className="px-5 py-3 text-left font-semibold">Sub-ledger</th>
                <th className="px-5 py-3 text-left font-semibold">System</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="px-5 py-3 font-mono text-xs">{a.code}</td>
                  <td className="px-5 py-3">{a.name}</td>
                  <td className="px-5 py-3 capitalize">{a.accountType}</td>
                  <td className="px-5 py-3 capitalize">{a.subLedger || "—"}</td>
                  <td className="px-5 py-3">{a.isSystem ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BackPanel>
  );
}
