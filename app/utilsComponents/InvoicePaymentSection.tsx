"use client";

import Link from "next/link";
import { CreditCard, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InvoicePaymentLine, ReceiptPayment, SalesInvoice } from "@/app/types";
import {
  PAYMENT_MODE_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
  invoicePaymentAccountLabel,
  resolveBalance,
  resolvePaymentStatus,
} from "./paymentConstants";
import { formatDate } from "./DateFormat";

interface InvoicePaymentSectionProps {
  invoice: SalesInvoice;
  payments?: ReceiptPayment[];
  initialPayments?: InvoicePaymentLine[];
  isLoadingPayments?: boolean;
}

function resolvePaymentAccountLabel(payment: InvoicePaymentLine) {
  if (payment.paymentMode === "cash") return "Cash Account";
  const snap = payment.bankAccountSnapshot;
  if (snap?.accountName) return snap.accountName;
  if (snap?.bankName) return snap.bankName;
  return invoicePaymentAccountLabel(payment.paymentMode);
}

export default function InvoicePaymentSection({
  invoice,
  payments = [],
  initialPayments = [],
  isLoadingPayments,
}: InvoicePaymentSectionProps) {
  const paidAmount = invoice.paidAmount ?? 0;
  const balanceAmount = resolveBalance(
    invoice.grandTotal,
    paidAmount,
    invoice.balanceAmount
  );
  const paymentStatus = resolvePaymentStatus(
    invoice.grandTotal,
    paidAmount,
    invoice.paymentStatus
  );
  const paidPct = invoice.grandTotal
    ? Math.min(100, Math.round((paidAmount / invoice.grandTotal) * 100))
    : 0;

  const customerId =
    typeof invoice.customerId === "object"
      ? invoice.customerId._id
      : invoice.customerId;

  const payUrl = `/reciept/payments/add?customerId=${customerId}&invoiceId=${invoice._id}`;

  const invoicePaymentRows = initialPayments.filter(
    (row) => Number(row.amount) > 0
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Invoice Amount" value={invoice.grandTotal} tone="slate" />
        <StatCard label="Amount Received" value={paidAmount} tone="green" />
        <StatCard label="Balance Due" value={balanceAmount} tone="orange" />
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Payment Status
          </p>
          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${PAYMENT_STATUS_STYLES[paymentStatus]}`}
          >
            {PAYMENT_STATUS_LABELS[paymentStatus]}
          </span>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Collection progress</span>
          <span className="text-gray-500">{paidPct}% collected</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all ${
              paymentStatus === "paid"
                ? "bg-green-500"
                : paymentStatus === "partial"
                  ? "bg-orange-500"
                  : "bg-red-400"
            }`}
            style={{ width: `${paidPct}%` }}
          />
        </div>
      </div>

      {balanceAmount > 0 && invoice.status === "confirmed" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Record payment against this invoice
            </p>
            <p className="text-xs text-emerald-700">
              Outstanding balance: ₹ {balanceAmount.toFixed(2)}
            </p>
          </div>
          <Button asChild>
            <Link href={payUrl}>
              <CreditCard className="mr-2 h-4 w-4" />
              Receive Payment
            </Link>
          </Button>
        </div>
      )}

      {invoicePaymentRows.length > 0 && (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b px-5 py-4">
            <h4 className="text-sm font-semibold text-gray-800">Payment at Invoice</h4>
            <p className="text-xs text-gray-400">
              Amount received when invoice {invoice.invoiceNo} was created
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Method</th>
                  <th className="px-4 py-3 text-left font-medium">Account</th>
                  <th className="px-4 py-3 text-left font-medium">Reference</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoicePaymentRows.map((payment, index) => (
                  <tr key={`invoice-payment-${index}`} className="border-t hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-700">
                      {PAYMENT_MODE_LABELS[payment.paymentMode] ?? payment.paymentMode}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {resolvePaymentAccountLabel(payment)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {payment.referenceNo?.trim() || "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-700">
                      ₹ {(Number(payment.amount) || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h4 className="text-sm font-semibold text-gray-800">Payment History</h4>
          <p className="text-xs text-gray-400">
            Receipts allocated to invoice {invoice.invoiceNo}
          </p>
        </div>

        {isLoadingPayments ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">Loading payments...</p>
        ) : payments.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">
            No payments recorded for this invoice yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Receipt No</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Mode</th>
                  <th className="px-4 py-3 text-right font-medium">Applied</th>
                  <th className="px-4 py-3 text-right font-medium">Balance After</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => {
                  const alloc = payment.allocations.find(
                    (a) => a.invoiceId === invoice._id
                  );
                  if (!alloc) return null;
                  const applied = alloc.amountAdjusted ?? 0;
                  return (
                    <tr
                      key={payment._id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/reciept/payments/${payment._id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {payment.voucherNo}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {PAYMENT_MODE_LABELS[payment.paymentMode] ??
                          payment.paymentMode}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-green-700">
                        ₹ {applied.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        ₹ {alloc.balanceAfter.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "slate" | "green" | "orange";
}) {
  const tones = {
    slate: "text-gray-900",
    green: "text-green-700",
    orange: "text-orange-600",
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
        <IndianRupee className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className={`mt-2 text-2xl font-bold ${tones[tone]}`}>
        ₹ {value.toFixed(2)}
      </p>
    </div>
  );
}
