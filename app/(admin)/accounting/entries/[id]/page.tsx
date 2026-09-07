"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { Button } from "@/components/ui/button";
import { useJournal, useReverseJournal } from "@/app/hooks/accountingHook/useAccounting";
import { formatDate } from "@/app/utilsComponents/DateFormat";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n || 0);

export default function JournalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: journal, isLoading, isError } = useJournal(id);
  const reverseMutation = useReverseJournal();

  const handleReverse = async () => {
    if (!journal || journal.status !== "posted" || journal.isReversal) return;
    if (!window.confirm("Reverse this journal entry?")) return;
    await reverseMutation.mutateAsync(id);
    router.push("/accounting/entries");
  };

  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center text-sm text-gray-400">Loading...</div>
      </BackPanel>
    );
  }

  if (isError || !journal) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center text-sm text-red-400">Journal not found.</div>
      </BackPanel>
    );
  }

  const canReverse = journal.status === "posted" && !journal.isReversal;

  return (
    <BackPanel>
      <div className="space-y-6 p-6">
        <PageHeader title={`Journal ${journal.journalNo}`} description="Journal entry details" />

        <div className="grid gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="font-medium">{formatDate(journal.entryDate)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Source</p>
            <p className="font-medium capitalize">{journal.referenceType?.replace(/_/g, " ")}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Reference</p>
            <p className="font-medium">{journal.referenceNo || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <p className="font-medium capitalize">{journal.status}</p>
          </div>
          {journal.narration && (
            <div className="md:col-span-2">
              <p className="text-xs text-gray-500">Narration</p>
              <p className="font-medium">{journal.narration}</p>
            </div>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Account</th>
                <th className="px-5 py-3 text-left font-semibold">Name</th>
                <th className="px-5 py-3 text-right font-semibold">Debit</th>
                <th className="px-5 py-3 text-right font-semibold">Credit</th>
              </tr>
            </thead>
            <tbody>
              {(journal.lines ?? []).map((line, i) => (
                <tr key={i} className="border-t">
                  <td className="px-5 py-3 font-mono text-xs">{line.accountCode}</td>
                  <td className="px-5 py-3">{line.accountName}</td>
                  <td className="px-5 py-3 text-right">{line.debit ? fmt(line.debit) : "—"}</td>
                  <td className="px-5 py-3 text-right">{line.credit ? fmt(line.credit) : "—"}</td>
                </tr>
              ))}
              <tr className="border-t bg-gray-50 font-semibold">
                <td colSpan={2} className="px-5 py-3 text-right">Total</td>
                <td className="px-5 py-3 text-right">{fmt(journal.totalDebit)}</td>
                <td className="px-5 py-3 text-right">{fmt(journal.totalCredit)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {canReverse && (
          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={handleReverse}
              disabled={reverseMutation.isPending}
            >
              {reverseMutation.isPending ? "Reversing..." : "Reverse Journal"}
            </Button>
          </div>
        )}
      </div>
    </BackPanel>
  );
}
