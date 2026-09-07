"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { Button } from "@/components/ui/button";
import { useChartOfAccounts, useCreateJournal } from "@/app/hooks/accountingHook/useAccounting";
import type { ManualJournalLinePayload } from "@/app/types/accounting";

const inputClass =
  "h-9 w-full border rounded-md px-3 text-sm outline-none focus:ring-2 focus:ring-black";

type LineRow = ManualJournalLinePayload & { key: number };

const emptyLine = (): LineRow => ({
  key: Date.now() + Math.random(),
  accountCode: "",
  debit: 0,
  credit: 0,
});

export default function ManualJournalPage() {
  const router = useRouter();
  const { data: accounts = [] } = useChartOfAccounts();
  const createMutation = useCreateJournal();

  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [referenceNo, setReferenceNo] = useState("");
  const [narration, setNarration] = useState("");
  const [lines, setLines] = useState<LineRow[]>([emptyLine(), emptyLine()]);

  const totalDebit = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  const balanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const updateLine = (key: number, patch: Partial<LineRow>) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!balanced) return;

    const payload = lines
      .filter((l) => l.accountCode && ((l.debit ?? 0) > 0 || (l.credit ?? 0) > 0))
      .map(({ accountCode, debit, credit, narration: lineNarration }) => ({
        accountCode,
        debit: Number(debit) || 0,
        credit: Number(credit) || 0,
        narration: lineNarration,
      }));

    await createMutation.mutateAsync({ entryDate, referenceNo, narration, lines: payload });
    router.push("/accounting/entries");
  };

  return (
    <BackPanel>
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <PageHeader title="Manual Journal" description="Create a manual double-entry journal" />

        <div className="grid gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Entry Date</label>
            <input type="date" required value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Reference No</label>
            <input value={referenceNo} onChange={(e) => setReferenceNo(e.target.value)} className={inputClass} placeholder="Optional" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Narration</label>
            <input value={narration} onChange={(e) => setNarration(e.target.value)} className={inputClass} placeholder="Optional" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Account</th>
                <th className="w-32 px-4 py-3 text-right font-semibold">Debit</th>
                <th className="w-32 px-4 py-3 text-right font-semibold">Credit</th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.key} className="border-t">
                  <td className="px-4 py-2">
                    <select
                      required
                      value={line.accountCode}
                      onChange={(e) => updateLine(line.key, { accountCode: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select account</option>
                      {accounts.map((a) => (
                        <option key={a._id} value={a.code}>
                          {a.code} — {a.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={line.debit || ""}
                      onChange={(e) => updateLine(line.key, { debit: Number(e.target.value), credit: 0 })}
                      className={`${inputClass} text-right`}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={line.credit || ""}
                      onChange={(e) => updateLine(line.key, { credit: Number(e.target.value), debit: 0 })}
                      className={`${inputClass} text-right`}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => setLines((prev) => prev.filter((l) => l.key !== line.key))}
                      className="text-xs text-red-500 hover:underline"
                      disabled={lines.length <= 2}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="border-t bg-gray-50 font-semibold">
                <td className="px-4 py-3 text-right">Total</td>
                <td className="px-4 py-3 text-right">₹ {totalDebit.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">₹ {totalCredit.toFixed(2)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        {!balanced && totalDebit + totalCredit > 0 && (
          <p className="text-sm text-red-600">Debits and credits must be equal before posting.</p>
        )}

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={() => setLines((prev) => [...prev, emptyLine()])}>
            Add Line
          </Button>
          <Button type="submit" disabled={!balanced || createMutation.isPending}>
            {createMutation.isPending ? "Posting..." : "Post Journal"}
          </Button>
        </div>
      </form>
    </BackPanel>
  );
}
