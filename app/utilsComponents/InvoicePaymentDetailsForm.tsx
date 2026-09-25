"use client";

import { Plus, Trash2 } from "lucide-react";
import type { InvoicePaymentLine, PaymentStatus } from "@/app/types";
import {
  DEFAULT_INVOICE_PAYMENT_MODE,
  PAYMENT_MODE_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
  deriveInvoicePaymentSummary,
  needsBankAccount,
} from "./paymentConstants";
import {
  InvoicePaymentAccountSelect,
  InvoicePaymentMethodSelect,
} from "./invoicePaymentFields";

export type InvoicePaymentFormRow = InvoicePaymentLine & { id: string };

export const emptyInvoicePaymentRow = (
  paymentMode = DEFAULT_INVOICE_PAYMENT_MODE
): InvoicePaymentFormRow => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  paymentMode,
  bankAccountId: "",
  amount: "",
  referenceNo: "",
});

const blockNeg = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["-", "e", "E", "+"].includes(e.key)) e.preventDefault();
};

interface InvoicePaymentDetailsFormProps {
  grandTotal: number;
  receivedAmount: number;
  payments: InvoicePaymentFormRow[];
  onPaymentsChange: (payments: InvoicePaymentFormRow[]) => void;
  saleMode?: "cash" | "credit";
  receivedLabel?: string;
}

export default function InvoicePaymentDetailsForm({
  grandTotal,
  receivedAmount,
  payments,
  onPaymentsChange,
  saleMode = "cash",
  receivedLabel = "Received",
}: InvoicePaymentDetailsFormProps) {
  const effectiveReceived = Math.min(Math.max(0, receivedAmount), grandTotal);
  const splitTotal = payments.reduce(
    (sum, row) => sum + (Number(row.amount) || 0),
    0
  );
  const hasSplitAmounts = splitTotal > 0;
  const { balance, status } = deriveInvoicePaymentSummary(
    grandTotal,
    effectiveReceived
  );
  const displayStatus: PaymentStatus =
    saleMode === "credit" && effectiveReceived <= 0 && grandTotal > 0
      ? "unpaid"
      : status;

  const updateRow = (index: number, patch: Partial<InvoicePaymentFormRow>) => {
    const next = payments.map((row, i) => (i === index ? { ...row, ...patch } : row));
    onPaymentsChange(next);
  };

  const addPayment = () => {
    onPaymentsChange([
      ...payments,
      emptyInvoicePaymentRow(DEFAULT_INVOICE_PAYMENT_MODE),
    ]);
  };

  const removePayment = (index: number) => {
    if (payments.length <= 1) {
      onPaymentsChange([emptyInvoicePaymentRow(DEFAULT_INVOICE_PAYMENT_MODE)]);
      return;
    }
    onPaymentsChange(payments.filter((_, i) => i !== index));
  };

  const maxForRow = (index: number) => {
    if (effectiveReceived <= 0) return 0;
    const otherTotal = payments.reduce(
      (sum, row, i) => (i === index ? sum : sum + (Number(row.amount) || 0)),
      0
    );
    return Math.max(0, Number((effectiveReceived - otherTotal).toFixed(2)));
  };

  return (
    <div className="w-full max-w-[550px] space-y-3 text-sm">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Part Payment Split</h4>
            <p className="text-xs text-gray-500">
              {effectiveReceived > 0
                ? `Optional — split ₹ ${effectiveReceived.toFixed(2)} across methods`
                : `Enter ${receivedLabel.toLowerCase()} amount in summary to split by method`}
            </p>
          </div>
          <button
            type="button"
            onClick={addPayment}
            className="flex shrink-0 items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
          >
            <Plus size={13} /> Add
          </button>
        </div>

        <div className="overflow-x-auto rounded-md border border-gray-100">
          <table className="w-full min-w-[520px] text-xs">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-2 py-2 text-left font-medium">Method</th>
                <th className="px-2 py-2 text-left font-medium">Account</th>
                <th className="px-2 py-2 text-right font-medium">Amount</th>
                <th className="px-2 py-2 text-left font-medium">Ref</th>
                <th className="px-2 py-2 w-8" />
              </tr>
            </thead>
            <tbody>
              {payments.map((row, index) => (
                <tr key={row.id} className="border-t align-top">
                  <td className="px-2 py-2">
                    <InvoicePaymentMethodSelect
                      name={`split-mode-${row.id}`}
                      value={row.paymentMode}
                      compact
                      onChange={(e) =>
                        updateRow(index, {
                          paymentMode: e.target.value,
                          bankAccountId: needsBankAccount(e.target.value)
                            ? row.bankAccountId
                            : "",
                        })
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <InvoicePaymentAccountSelect
                      paymentMode={row.paymentMode}
                      name={`split-account-${row.id}`}
                      value={row.bankAccountId || ""}
                      compact
                      onChange={(e) =>
                        updateRow(index, { bankAccountId: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={row.amount}
                      min="0"
                      max={maxForRow(index)}
                      step="0.01"
                      onKeyDown={blockNeg}
                      onChange={(e) => {
                        const raw = Number(e.target.value) || 0;
                        const capped = Math.min(raw, maxForRow(index));
                        updateRow(index, {
                          amount: e.target.value === "" ? "" : String(capped),
                        });
                      }}
                      className="w-full min-w-[80px] rounded-md border border-gray-300 bg-white px-2 py-1.5 text-right outline-none focus:border-blue-600"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={row.referenceNo || ""}
                      onChange={(e) =>
                        updateRow(index, { referenceNo: e.target.value })
                      }
                      className="w-full min-w-[72px] rounded-md border border-gray-300 bg-white px-2 py-1.5 outline-none focus:border-blue-600"
                      placeholder="Ref"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => removePayment(index)}
                      disabled={payments.length <= 1}
                      className="text-red-400 hover:text-red-600 disabled:opacity-20"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!hasSplitAmounts && effectiveReceived > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            Leave amounts empty to use the payment method selected above.
          </p>
        )}

        <div className="mt-4 space-y-2 border-t pt-3">
          <div className="flex justify-between text-gray-600">
            <span>Invoice Total</span>
            <span>₹ {grandTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-emerald-800 font-medium">
            <span>{receivedLabel}</span>
            <span>₹ {effectiveReceived.toFixed(2)}</span>
          </div>
          {hasSplitAmounts &&
            payments
              .filter((row) => Number(row.amount) > 0)
              .map((row) => (
                <div
                  key={`summary-${row.id}`}
                  className="flex justify-between text-gray-700"
                >
                  <span>{PAYMENT_MODE_LABELS[row.paymentMode] ?? row.paymentMode}</span>
                  <span>₹ {(Number(row.amount) || 0).toFixed(2)}</span>
                </div>
              ))}
          {hasSplitAmounts &&
            Math.abs(splitTotal - effectiveReceived) > 0.009 && (
              <p className="text-xs text-orange-600">
                Split total ₹ {splitTotal.toFixed(2)} must equal ₹{" "}
                {effectiveReceived.toFixed(2)}
              </p>
            )}
          <div className="flex justify-between font-medium text-gray-800 border-t pt-2">
            <span>Total Paid</span>
            <span>₹ {effectiveReceived.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-orange-600 font-medium">
            <span>Balance</span>
            <span>₹ {balance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${PAYMENT_STATUS_STYLES[displayStatus]}`}
            >
              {PAYMENT_STATUS_LABELS[displayStatus]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function buildInvoicePaymentsPayload(
  rows: InvoicePaymentFormRow[],
  defaultBankAccountId = ""
) {
  const fallbackBankId =
    defaultBankAccountId ||
    rows.find((row) => row.bankAccountId)?.bankAccountId ||
    "";

  return rows
    .filter((row) => Number(row.amount) > 0)
    .map((row) => ({
      paymentMode: row.paymentMode,
      bankAccountId: needsBankAccount(row.paymentMode)
        ? row.bankAccountId || fallbackBankId || undefined
        : undefined,
      amount: Number(row.amount),
      referenceNo: row.referenceNo?.trim() || undefined,
    }));
}

export function sumInvoicePayments(rows: InvoicePaymentFormRow[]) {
  return rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
}

export function resolvePaymentsForSubmit(
  rows: InvoicePaymentFormRow[],
  receivedAmount: number,
  defaultPaymentMode: string,
  defaultBankAccountId = ""
) {
  const splits = buildInvoicePaymentsPayload(rows, defaultBankAccountId);
  if (splits.length > 0) return splits;

  if (receivedAmount <= 0) return [];

  return [
    {
      paymentMode: defaultPaymentMode || DEFAULT_INVOICE_PAYMENT_MODE,
      bankAccountId: needsBankAccount(defaultPaymentMode)
        ? defaultBankAccountId || undefined
        : undefined,
      amount: receivedAmount,
      referenceNo: undefined,
    },
  ];
}

export function resolveReceivedPaidAmount(
  grandTotal: number,
  receivedInput: number | string,
  saleMode: "cash" | "credit" = "cash"
) {
  const grand = grandTotal;
  const received = Number(receivedInput) || 0;
  const paid =
    saleMode === "credit"
      ? received
      : received > 0
        ? received
        : grand;
  return Math.min(paid, grand);
}
