"use client";

import { useParams, useRouter } from "next/navigation";
import { Printer, RotateCcw } from "lucide-react";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import { usePurchaseInvoice } from "@/app/hooks/purchaseHooks/usePurchaseInvoice";
import { amountInWords } from "@/app/utilsComponents/AmountInWords";
import { footerReturnBtn, printFooterButton } from "@/app/utilsComponents/form-footer";
import { invoiceItemsTableClass } from "@/app/utilsComponents/report-ui";
import { DocumentAttachmentsView } from "@/app/utilsComponents/DocumentAttachments";

const TABS = [
  { key: "invoice", label: "Invoice Info" },
  { key: "vendor", label: "Vendor" },
  { key: "items", label: "Items" },
  { key: "summary", label: "Summary" },
  { key: "references", label: "References" },
  { key: "audit", label: "Audit" },
];

export default function PurchaseViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: invoice, isLoading, isError } = usePurchaseInvoice(id);

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
          <p className="text-sm text-red-400">Failed to load.</p>
        </div>
      </BackPanel>
    );
  }

  return (
    <BackPanel
      tabs={TABS}
      buttons={[
        ...(invoice.status === "confirmed"
          ? [
              {
                label: "Create Return",
                onClick: () =>
                  router.push(`/purchase/purchaseReturn/add?invoiceId=${invoice._id}`),
                icon: <RotateCcw size={14} />,
                className: footerReturnBtn,
              },
            ]
          : []),
        // {
        //   ...printFooterButton(() => window.print()),
        //   icon: <Printer size={14} />,
        // },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {invoice.invoiceNo}
            </h1>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              invoice.status === "confirmed"
                ? "bg-green-100 text-green-700"
                : invoice.status === "draft"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-600"
            }`}
          >
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>

        <ViewSection id="invoice" title="Invoice Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField
              label="Invoice No"
              value={invoice.invoiceNo}
            />
            <ViewField label="Vendor Invoice No" value={invoice.vendorInvoiceNo} />
            <ViewField
              label="Purchase Date"
              value={new Date(invoice.purchaseDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
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
              value={invoice.status}
              capitalize
              badge
              badgeColor={
                invoice.status === "confirmed"
                  ? "green"
                  : invoice.status === "draft"
                    ? "yellow"
                    : "red"
              }
            />
            <ViewField label="Notes" value={invoice.notes} />
          </div>
        </ViewSection>

        <ViewSection id="vendor" title="Vendor Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Vendor Name" value={invoice.vendorSnapshot?.name} />
            <ViewField label="GSTIN" value={invoice.vendorSnapshot?.gstin} />
            <ViewField label="Place" value={invoice.vendorSnapshot?.place} />
            <ViewField label="State" value={invoice.vendorSnapshot?.state} />
            <ViewField label="State Code" value={invoice.vendorSnapshot?.stateCode} />
            <ViewField label="Address" value={invoice.vendorSnapshot?.address} />
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
                  <th className="px-4 py-3 text-right font-medium">Rate</th>
                  <th className="px-4 py-3 text-right font-medium">Qty</th>
                  <th className="px-4 py-3 text-right font-medium">Disc %</th>
                  <th className="px-4 py-3 text-right font-medium">Taxable</th>
                  <th className="px-4 py-3 text-right font-medium">Tax%</th>
                  <th className="px-4 py-3 text-right font-medium">SGST</th>
                  <th className="px-4 py-3 text-right font-medium">CGST</th>
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
                    <td className="px-4 py-3 text-right">₹{item.rate.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">{item.qty}</td>
                    <td className="px-4 py-3 text-right">
                      {(item.discount ?? 0) > 0 ? `${item.discount}%` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">₹{item.taxableValue.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{item.taxPercent}%</td>
                    <td className="px-4 py-3 text-right">₹{item.sgst.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">₹{item.cgst.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-semibold">₹{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </ViewSection>

        <ViewSection id="summary" title="Summary">
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between border-b py-1.5 text-gray-600">
                <span>Net Amount</span>
                <span className="font-medium">₹ {invoice.netAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 text-gray-600">
                <span>Total SGST</span>
                <span>₹ {invoice.totalSGST.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 text-gray-600">
                <span>Total CGST</span>
                <span>₹ {invoice.totalCGST.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 text-gray-600">
                <span>Total Tax</span>
                <span>₹ {invoice.totalTax.toFixed(2)}</span>
              </div>
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
              <div className="flex justify-between py-2 text-base font-bold text-gray-900">
                <span>Grand Total</span>
                <span>₹ {invoice.grandTotal.toFixed(2)}</span>
              </div>
              <p className="border-t pt-2 text-xs italic text-gray-400">
                {amountInWords(invoice.grandTotal)}
              </p>
            </div>
          </div>
        </ViewSection>

        <ViewSection id="references" title="Reference Documents">
          <DocumentAttachmentsView attachments={invoice.attachments} />
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
