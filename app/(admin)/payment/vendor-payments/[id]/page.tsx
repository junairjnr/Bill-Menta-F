"use client";

import { useParams, useRouter } from "next/navigation";
import { Printer } from "lucide-react";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import ViewPageHeader from "@/app/utilsComponents/ViewPageHeader";
import {
  useDeleteVoucher,
  useVendorPayment,
} from "@/app/hooks/masterHooks/paymentHook/usePayment";
import { formatDate } from "@/app/utilsComponents/DateFormat";
import { PAYMENT_MODE_LABELS } from "@/app/utilsComponents/paymentConstants";
import { printFooterButton } from "@/app/utilsComponents/form-footer";
import type { BankAccountSnapshot, ReceiptPayment } from "@/app/types";

const TABS = [
  { key: "payment", label: "Payment Info" },
  { key: "vendor", label: "Vendor" },
  { key: "allocations", label: "Invoice Allocations" },
  { key: "audit", label: "Audit" },
];

const MODE_BADGE: Record<string, "green" | "blue" | "gray" | "yellow"> = {
  cash: "green",
  cheque: "blue",
  bank_transfer: "gray",
  bank: "gray",
  upi: "yellow",
};

function resolveBank(voucher: ReceiptPayment): BankAccountSnapshot | undefined {
  if (voucher.bankAccountSnapshot?.bankName) return voucher.bankAccountSnapshot;
  const bank = voucher.bankAccountId as BankAccountSnapshot | string | undefined;
  if (bank && typeof bank === "object") return bank;
  return undefined;
}

export default function VendorPaymentViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: payment, isLoading, isError } = useVendorPayment(id);
  const { mutateAsync: cancelPayment, isPending: deleting } =
    useDeleteVoucher("payment");

  const handleDelete = async () => {
    await cancelPayment(id);
    router.push("/payment/vendor-payments");
  };

  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError || !payment) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load payment voucher.</p>
        </div>
      </BackPanel>
    );
  }

  const bank = resolveBank(payment);
  const vendor = payment.partySnapshot;
  const allocations = payment.allocations ?? [];
  const amount = payment.totalAmount ?? 0;

  return (
    <BackPanel
      tabs={TABS}
      deleteItemName={payment.voucherNo}
      onDelete={handleDelete}
      deleting={deleting}
      buttons={[
        {
          ...printFooterButton(() => window.print()),
          icon: <Printer size={14} />,
        },
      ]}
    >
      <div className="space-y-6">
        <ViewPageHeader title={payment.voucherNo} subtitle={formatDate(payment.date)} />

        <ViewSection id="payment" title="Payment Voucher Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Voucher No" value={payment.voucherNo} />
            <ViewField label="Payment Date" value={formatDate(payment.date)} />
            <ViewField label="Amount Paid" value={`₹ ${amount.toFixed(2)}`} />
            <ViewField
              label="Payment Mode"
              value={PAYMENT_MODE_LABELS[payment.paymentMode] ?? payment.paymentMode}
              badge
              badgeColor={MODE_BADGE[payment.paymentMode] ?? "gray"}
            />
            <ViewField
              label="Status"
              value={payment.status === "completed" ? "Completed" : payment.status}
              badge
              badgeColor={
                payment.status === "completed"
                  ? "green"
                  : payment.status === "cancelled"
                    ? "red"
                    : "gray"
              }
            />
            {payment.referenceNo && (
              <ViewField label="Reference No" value={payment.referenceNo} />
            )}
            {bank?.bankName && (
              <>
                <ViewField label="Bank" value={bank.bankName} />
                <ViewField label="Account Name" value={bank.accountName} />
                <ViewField label="Account No" value={bank.accountNumber} />
                {bank.ifscCode && <ViewField label="IFSC" value={bank.ifscCode} />}
                {bank.upiId && <ViewField label="UPI ID" value={bank.upiId} />}
              </>
            )}
            {payment.notes && <ViewField label="Notes" value={payment.notes} />}
          </div>
        </ViewSection>

        <ViewSection id="vendor" title="Vendor Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Name" value={vendor?.name} />
            <ViewField label="Phone" value={vendor?.phone} />
            <ViewField label="GSTIN" value={vendor?.gstin} />
            <ViewField label="Place" value={vendor?.place} />
            <ViewField label="State" value={vendor?.state} />
            <ViewField label="State Code" value={vendor?.stateCode} />
            <ViewField label="Address" value={vendor?.address} />
          </div>
        </ViewSection>

        <ViewSection id="allocations" title="Invoice Allocations">
          {allocations.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              No invoice allocations recorded.
            </p>
          ) : (
            <div className="-mx-6 -mb-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">#</th>
                    <th className="px-4 py-3 text-left font-medium">Invoice No</th>
                    <th className="px-4 py-3 text-left font-medium">Invoice Date</th>
                    <th className="px-4 py-3 text-right font-medium">Invoice Total</th>
                    <th className="px-4 py-3 text-right font-medium">Paid Before</th>
                    <th className="px-4 py-3 text-right font-medium">This Payment</th>
                    <th className="px-4 py-3 text-right font-medium">Balance After</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((alloc, i) => {
                    const applied = alloc.amountAdjusted ?? 0;
                    return (
                      <tr
                        key={alloc.invoiceId}
                        onClick={() =>
                          router.push(`/purchase/purchaseInvoice/${alloc.invoiceId}`)
                        }
                        className="cursor-pointer border-t hover:bg-gray-50"
                      >
                        <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-blue-600">
                          {alloc.invoiceNo}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatDate(alloc.invoiceDate)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          ₹ {alloc.invoiceTotal.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-500">
                          ₹ {alloc.paidBefore.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-green-700">
                          ₹ {applied.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">
                          ₹ {alloc.balanceAfter.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              alloc.balanceAfter === 0
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {alloc.balanceAfter === 0 ? "Paid" : "Partial"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t bg-gray-50">
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-3 text-right text-sm font-semibold text-gray-700"
                    >
                      Total Paid
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-green-700">
                      ₹ {amount.toFixed(2)}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </ViewSection>

        <ViewSection id="audit" title="Audit Information">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Created" value={formatDate(payment.createdAt)} />
            <ViewField label="Last Updated" value={formatDate(payment.updatedAt)} />
          </div>
        </ViewSection>
      </div>
    </BackPanel>
  );
}
