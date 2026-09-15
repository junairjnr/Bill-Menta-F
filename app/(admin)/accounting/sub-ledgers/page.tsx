"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCustomers } from "@/app/hooks/masterHooks/customerHook/useCustomer";
import { useSubLedger } from "@/app/hooks/accountingHook/useAccounting";
import { DROPDOWN_LIMIT } from "@/app/config/pagination";
import {
  FilterField,
  FilterSelect,
  ReportShell,
  ReportTable,
  TableState,
  fmtDate,
  fmtMoney,
  reportRowClass,
} from "@/app/utilsComponents/report-ui";

const COLS = [
  { label: "Date" },
  { label: "Journal" },
  { label: "Reference" },
  { label: "Narration" },
  { label: "Debit", align: "right" as const },
  { label: "Credit", align: "right" as const },
  { label: "Balance", align: "right" as const },
];

function SubLedgersContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("partyType") === "vendor" ? "vendor" : "customer";
  const initialId = searchParams.get("partyId") || "";
  const initialName = searchParams.get("partyName") || "";

  const [partyType, setPartyType] = useState<"customer" | "vendor">(initialType);
  const [partyId, setPartyId] = useState(initialId);

  useEffect(() => {
    const nextType = searchParams.get("partyType") === "vendor" ? "vendor" : "customer";
    const nextId = searchParams.get("partyId") || "";
    setPartyType(nextType);
    setPartyId(nextId);
  }, [searchParams]);

  const { data: customerData } = useCustomers({ limit: DROPDOWN_LIMIT });
  const parties = useMemo(() => {
    const list = customerData?.data ?? [];
    return list.filter((c: { type?: string }) =>
      partyType === "customer" ? c.type === "sales" : c.type === "purchase"
    );
  }, [customerData, partyType]);

  const { data, isLoading, isError } = useSubLedger(partyId, partyType);
  const rows = data?.transactions ?? [];
  const selectedName =
    initialName ||
    parties.find((p: { _id: string }) => p._id === partyId)?.name ||
    "";

  return (
    <ReportShell
      title="Sub Ledger"
      description="Party-wise ledger from journal entries"
      onClear={() => {
        setPartyType("customer");
        setPartyId("");
      }}
      activeFilterCount={partyId ? 1 : 0}
      summary={
        partyId
          ? [
              { label: "Party", value: selectedName || partyId },
              { label: "Closing Balance", value: fmtMoney(data?.closingBalance ?? 0), highlight: true },
            ]
          : undefined
      }
      summaryLoading={isLoading && !!partyId}
      filters={
        <>
          <FilterField label="Party Type">
            <FilterSelect
              value={partyType}
              onChange={(v) => {
                setPartyType(v as "customer" | "vendor");
                setPartyId("");
              }}
              options={[
                { value: "customer", label: "Customer" },
                { value: "vendor", label: "Vendor" },
              ]}
            />
          </FilterField>
          <FilterField label="Party" wide>
            <FilterSelect
              value={partyId}
              onChange={setPartyId}
              options={[
                { value: "", label: "Select party" },
                ...parties.map((p: { _id: string; name: string }) => ({
                  value: p._id,
                  label: p.name,
                })),
                ...(partyId && !parties.some((p: { _id: string }) => p._id === partyId)
                  ? [{ value: partyId, label: initialName || partyId }]
                  : []),
              ]}
            />
          </FilterField>
        </>
      }
    >
      <ReportTable columns={COLS}>
        {!partyId ? (
          <TableState colSpan={7} empty message="Select a party to view sub-ledger" />
        ) : isLoading || isError || rows.length === 0 ? (
          <TableState
            colSpan={7}
            loading={isLoading}
            error={isError}
            empty={!isLoading && !isError && rows.length === 0}
            message={
              !isLoading && !isError && rows.length === 0
                ? "No journal entries found for this party"
                : undefined
            }
          />
        ) : (
          rows.map((row, i) => (
            <tr key={`${row.journalNo}-${i}`} className={reportRowClass(i)}>
              <td className="px-4 py-3">{fmtDate(row.date)}</td>
              <td className="px-4 py-3 font-mono text-xs">{row.journalNo}</td>
              <td className="px-4 py-3">{row.referenceNo || row.referenceType}</td>
              <td className="px-4 py-3 max-w-xs truncate">{row.narration || "—"}</td>
              <td className="px-4 py-3 text-right">{row.debit ? fmtMoney(row.debit) : "—"}</td>
              <td className="px-4 py-3 text-right">{row.credit ? fmtMoney(row.credit) : "—"}</td>
              <td className="px-4 py-3 text-right font-medium">{fmtMoney(row.balance)}</td>
            </tr>
          ))
        )}
      </ReportTable>
    </ReportShell>
  );
}

export default function SubLedgersPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading sub-ledger...</div>}>
      <SubLedgersContent />
    </Suspense>
  );
}
