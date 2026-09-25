"use client";

import { useParams, useRouter } from "next/navigation";
import { CreditCard, Printer, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewPageHeader from "@/app/utilsComponents/ViewPageHeader";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import InvoicePaymentSection from "@/app/utilsComponents/InvoicePaymentSection";
import { useSalesInvoice } from "@/app/hooks/salesHooks/useSalesInvoice";
import { useInvoicePayments } from "@/app/hooks/masterHooks/paymentHook/usePayment";
import { useCompanySettings } from "@/app/hooks/settingsHook/useSettings";
import { useBankAccounts } from "@/app/hooks/masterHooks/bankHook/useBank";
import { printSalesInvoicePdf } from "@/app/pdf/salesInvoice/printSalesInvoice";
import toast from "react-hot-toast";
import { amountInWords } from "@/app/utilsComponents/AmountInWords";
import {
  footerPrimaryBtn,
  footerReturnBtn,
  printFooterButton,
} from "@/app/utilsComponents/form-footer";
import { invoiceItemsTableClass, invoiceViewSummaryPanelClass, invoiceSummaryGrandTotalClass } from "@/app/utilsComponents/report-ui";
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
  resolveBalance,
  resolveCustomerName,
  resolvePaymentStatus,
} from "@/app/utilsComponents/paymentConstants";
import { gstSupplyTypeLabel } from "@/app/utils/gstTax";

const TABS = [
  { key: "invoice", label: "Invoice Info" },
  { key: "customer", label: "Customer" },
  { key: "items", label: "Items" },
  { key: "summary", label: "Summary" },
  { key: "payment", label: "Payment" },
  { key: "audit", label: "Audit" },
];

export default function SalesInvoiceViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: invoice, isLoading, isError } = useSalesInvoice(id);
  const { data: company } = useCompanySettings();
  const { data: bankData } = useBankAccounts();
  const bankAccounts = bankData?.data ?? [];

  const customerId =
    invoice && typeof invoice.customerId === "object"
      ? invoice.customerId._id
      : String(invoice?.customerId ?? "");

  const { data: invoicePayments = [], isLoading: paymentsLoading } =
    useInvoicePayments(id, customerId);

  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError || !invoice) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load invoice.</p>
        </div>
      </BackPanel>
    );
  }

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
  const lineNetAmount =
    invoice.lineNetAmount ??
    invoice.items.reduce((s: number, item: { taxableValue?: number }) => s + (item.taxableValue ?? 0), 0);
  const cashDiscountAmt = invoice.cashDiscountAmt ?? 0;
  const billTotal = invoice.billTotal ?? invoice.grandTotal + cashDiscountAmt;
  const hasTax = (invoice.totalTax ?? 0) > 0;
  const isInterState = invoice.gstSupplyType === "inter";
  const totalIGST = invoice.totalIGST ?? 0;

  const payUrl = `/reciept/payments/add?customerId=${customerId}&invoiceId=${invoice._id}`;

  const customerPopulated =
    invoice.customerId && typeof invoice.customerId === "object"
      ? (invoice.customerId as {
          name?: string;
          gstin?: string;
          address?: {
            line1?: string;
            place?: string;
            city?: string;
            state?: string;
            stateCode?: string;
          };
        })
      : null;
  const customerSnap = invoice.customerSnapshot ?? {};
  const customerDetails = {
    name: resolveCustomerName(invoice),
    gstin: customerSnap.gstin || customerPopulated?.gstin || "—",
    place: customerSnap.place || customerPopulated?.address?.place || "—",
    state: customerSnap.state || customerPopulated?.address?.state || "—",
    stateCode: customerSnap.stateCode || customerPopulated?.address?.stateCode || "—",
    address:
      customerSnap.address ||
      [customerPopulated?.address?.line1, customerPopulated?.address?.place, customerPopulated?.address?.city]
        .filter(Boolean)
        .join(", ") ||
      "—",
  };

  return (
    <BackPanel
      tabs={TABS}
      buttons={[
        ...(invoice.status === "confirmed"
          ? [
              {
                label: "Create Return",
                onClick: () =>
                  router.push(`/sales/salesReturn/add?invoiceId=${invoice._id}`),
                icon: <RotateCcw size={14} />,
                className: footerReturnBtn,
              },
            ]
          : []),
        ...(balanceAmount > 0 && invoice.status === "confirmed"
          ? [
              {
                label: "Receive Payment",
                onClick: () => router.push(payUrl),
                icon: <CreditCard size={14} />,
                className: footerPrimaryBtn,
              },
            ]
          : []),
        {
          ...printFooterButton(async () => {
            try {
              await printSalesInvoicePdf(invoice, company ?? null, bankAccounts);
            } catch (err: unknown) {
              const message =
                err instanceof Error ? err.message : "Failed to generate invoice PDF";
              toast.error(message);
            }
          }),
          icon: <Printer size={14} />,
        },
      ]}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <ViewPageHeader
            title={invoice.invoiceNo}
            subtitle={new Date(invoice.invoiceDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          />
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              invoice.salesType === "retail"
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {invoice.salesType.charAt(0).toUpperCase() + invoice.salesType.slice(1)}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              invoice.status === "confirmed"
                ? "bg-green-100 text-green-700"
                : invoice.status === "draft"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-600"
            }`}
          >
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${PAYMENT_STATUS_STYLES[paymentStatus]}`}
          >
            {PAYMENT_STATUS_LABELS[paymentStatus]}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              invoice.saleMode === "cash"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {invoice.saleMode === "cash" ? "Cash Sale" : "Credit Sale"}
          </span>
        </div>

        <ViewSection id="invoice" title="Invoice Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ViewField label="Invoice No" value={invoice.invoiceNo} />
            <ViewField
              label="Invoice Date"
              value={new Date(invoice.invoiceDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            />
            <ViewField
              label="Sales Type"
              value={invoice.salesType.charAt(0).toUpperCase() + invoice.salesType.slice(1)}
              badge
              badgeColor={invoice.salesType === "retail" ? "blue" : "gray"}
            />
            <ViewField
              label="Price Level"
              value={
                invoice.priceLevelSnapshot?.name
                  ? `${invoice.priceLevelSnapshot.name} (${invoice.priceLevelSnapshot.taxPercent}%)`
                  : "—"
              }
            />
            <ViewField
              label="Warehouse"
              value={
                typeof invoice.warehouseId === "object"
                  ? invoice.warehouseId.name
                  : "—"
              }
            />
            <ViewField
              label="Status"
              value={invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              badge
              badgeColor={
                invoice.status === "confirmed"
                  ? "green"
                  : invoice.status === "draft"
                    ? "yellow"
                    : "red"
              }
            />
            <ViewField
              label="Sale Mode"
              value={invoice.saleMode === "cash" ? "Cash Sale" : "Credit Sale"}
              badge
              badgeColor={invoice.saleMode === "cash" ? "green" : "gray"}
            />
            {cashDiscountAmt > 0 ? (
              <ViewField
                label="Cash Discount"
                value={`₹ ${cashDiscountAmt.toFixed(2)}`}
              />
            ) : null}
            {invoice.notes && <ViewField label="Notes" value={invoice.notes} />}
          </div>
        </ViewSection>

        <ViewSection id="customer" title="Customer Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ViewField label="Customer Name" value={customerDetails.name} />
            <ViewField label="GSTIN" value={customerDetails.gstin} />
            <ViewField
              label="Supplier State Code"
              value={invoice.supplierStateCode || "—"}
            />
            <ViewField label="Place of Supply" value={customerDetails.place} />
            <ViewField label="Place of Supply State" value={customerDetails.state} />
            <ViewField
              label="Place of Supply State Code"
              value={invoice.placeOfSupplyStateCode || customerDetails.stateCode}
            />
            {invoice.gstSupplyType && (
              <ViewField
                label="GST Supply Type"
                value={gstSupplyTypeLabel(invoice.gstSupplyType)}
              />
            )}
            <ViewField label="Address" value={customerDetails.address} />
          </div>
        </ViewSection>

        <ViewSection id="items" title="Items">
          <table className={invoiceItemsTableClass}>
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">#</th>
                  <th className="px-4 py-3 text-left font-medium">Item</th>
                  <th className="px-4 py-3 text-left font-medium">HSN</th>
                  <th className="px-4 py-3 text-left font-medium">UOM</th>
                  <th className="px-4 py-3 text-right font-medium">Base Rate</th>
                  <th className="px-4 py-3 text-right font-medium">Rate</th>
                  <th className="px-4 py-3 text-right font-medium">Qty</th>
                  <th className="px-4 py-3 text-right font-medium">Disc%</th>
                  <th className="px-4 py-3 text-right font-medium">Taxable Value</th>
                  {hasTax &&
                    (isInterState ? (
                      <th className="px-4 py-3 text-right font-medium">IGST</th>
                    ) : (
                      <>
                        <th className="px-4 py-3 text-right font-medium">SGST</th>
                        <th className="px-4 py-3 text-right font-medium">CGST</th>
                      </>
                    ))}
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item: any, i: number) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-400">{item.slNo}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {typeof item.itemId === "object" ? item.itemId.name : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.hsn || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {typeof item.uomId === "object" ? item.uomId.shortCode : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      ₹{item.baseRate.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      ₹{item.rate.toFixed(2)}
                      <span className="ml-1 text-xs text-green-600">+{item.priceLevelPct}%</span>
                    </td>
                    <td className="px-4 py-3 text-right">{item.qty}</td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {item.discount > 0 ? `${item.discount}%` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">₹{item.taxableValue.toFixed(2)}</td>
                    {hasTax &&
                      (isInterState ? (
                        <td className="px-4 py-3 text-right">
                          ₹{(item.igst ?? 0).toFixed(2)}
                        </td>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-right">₹{item.sgst.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">₹{item.cgst.toFixed(2)}</td>
                        </>
                      ))}
                    <td className="px-4 py-3 text-right font-semibold">₹{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </ViewSection>

        <ViewSection id="summary" title="Summary">
          <div className="flex justify-end">
            <div className={invoiceViewSummaryPanelClass}>
              {cashDiscountAmt > 0 ? (
                <div className="flex justify-between border-b py-1.5 text-red-600">
                  <span>Discount Applied</span>
                  <span>- ₹ {cashDiscountAmt.toFixed(2)}</span>
                </div>
              ) : (
                <div className="flex justify-between border-b py-1.5 text-gray-600">
                  <span>Discount Amount</span>
                  <span>- ₹ 0.00</span>
                </div>
              )}
              <div className="flex justify-between border-b py-1.5 text-gray-600">
                <span>Subtotal (Taxable Value)</span>
                <span className="font-medium">₹ {lineNetAmount.toFixed(2)}</span>
              </div>
              {hasTax && (
                <>
                  {isInterState ? (
                    <div className="flex justify-between border-b py-1.5 text-gray-600">
                      <span>Total IGST</span>
                      <span>₹ {totalIGST.toFixed(2)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between border-b py-1.5 text-gray-600">
                        <span>Total SGST</span>
                        <span>₹ {invoice.totalSGST.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-b py-1.5 text-gray-600">
                        <span>Total CGST</span>
                        <span>₹ {invoice.totalCGST.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between border-b py-1.5 text-gray-600">
                    <span>Total Tax Amount</span>
                    <span>₹ {invoice.totalTax.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between border-b py-1.5 font-semibold text-gray-800">
                <span>Total</span>
                <span>₹ {invoice.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 text-gray-500">
                <span>Round Off</span>
                <span>
                  {invoice.roundOff >= 0 ? "+" : ""}
                  {invoice.roundOff.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-b py-1.5 font-semibold text-gray-800">
                <span>Bill Total</span>
                <span>₹ {billTotal.toFixed(2)}</span>
              </div>
              <div className={invoiceSummaryGrandTotalClass}>
                <span>Amount to Collect</span>
                <span>₹ {invoice.grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t py-1.5 text-green-700">
                <span>Amount Received</span>
                <span>₹ {paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5 font-semibold text-orange-600">
                <span>Balance Due</span>
                <span>₹ {balanceAmount.toFixed(2)}</span>
              </div>
              <p className="border-t pt-2 text-xs italic text-gray-400">
                {amountInWords(invoice.grandTotal)}
              </p>
            </div>
          </div>
        </ViewSection>

        <ViewSection id="payment" title="Payment & Collections">
          <InvoicePaymentSection
            invoice={invoice}
            payments={invoicePayments}
            initialPayments={invoice.payments}
            isLoadingPayments={paymentsLoading}
          />
        </ViewSection>

        <ViewSection id="audit" title="Audit Information">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField
              label="Created"
              value={new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            />
          </div>
        </ViewSection>
      </div>
    </BackPanel>
  );
}
