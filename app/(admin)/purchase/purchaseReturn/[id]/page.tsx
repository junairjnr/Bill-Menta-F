"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Printer } from "lucide-react";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewPageHeader from "@/app/utilsComponents/ViewPageHeader";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import { usePurchaseReturn } from "@/app/hooks/purchaseHooks/usePurchaseReturn";
import { amountInWords } from "@/app/utilsComponents/AmountInWords";
import { printFooterButton } from "@/app/utilsComponents/form-footer";
import { invoiceItemsTableClass } from "@/app/utilsComponents/report-ui";
import { DocumentAttachmentsView } from "@/app/utilsComponents/DocumentAttachments";

const TABS = [
  { key: "return", label: "Return Info" },
  { key: "vendor", label: "Vendor" },
  { key: "items", label: "Items" },
  { key: "summary", label: "Summary" },
  { key: "references", label: "References" },
  { key: "audit", label: "Audit" },
];

export default function PurchaseReturnViewPage() {
  const { id } = useParams<{ id: string }>();
  const { data: ret, isLoading, isError } = usePurchaseReturn(id);

  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError || !ret) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load return.</p>
        </div>
      </BackPanel>
    );
  }

  const invoiceId = ret.purchaseInvoiceId
    ? typeof ret.purchaseInvoiceId === "object"
      ? ret.purchaseInvoiceId._id
      : ret.purchaseInvoiceId
    : null;
  const isManual = ret.returnMode === "manual" || !invoiceId;

  return (
    <BackPanel
      tabs={TABS}
      buttons={[
        {
          ...printFooterButton(() => window.print()),
          icon: <Printer size={14} />,
        },
      ]}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <ViewPageHeader
            title={ret.returnNo}
            subtitle={new Date(ret.returnDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          />
          {isManual ? (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              Manual return
            </span>
          ) : (
            <Link
              href={`/purchase/purchaseInvoice/${invoiceId}`}
              className="text-sm text-blue-600 hover:underline"
            >
              Against {ret.originalInvoiceNo}
            </Link>
          )}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              ret.status === "confirmed"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {ret.status.charAt(0).toUpperCase() + ret.status.slice(1)}
          </span>
        </div>

        <ViewSection id="return" title="Return Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Return No" value={ret.returnNo} />
            <ViewField
              label="Return Date"
              value={new Date(ret.returnDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            />
            <ViewField label="Original Invoice" value={ret.originalInvoiceNo} />
            <ViewField label="Vendor Invoice No" value={ret.vendorInvoiceNo} />
            <ViewField label="Warehouse" value={ret.warehouseId?.name} />
            <ViewField label="Notes" value={ret.notes} />
          </div>
        </ViewSection>

        <ViewSection id="vendor" title="Vendor Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Vendor Name" value={ret.vendorSnapshot?.name ?? ret.vendorId?.name} />
            <ViewField label="GSTIN" value={ret.vendorSnapshot?.gstin} />
            <ViewField label="Place" value={ret.vendorSnapshot?.place} />
            <ViewField label="State" value={ret.vendorSnapshot?.state} />
            <ViewField label="State Code" value={ret.vendorSnapshot?.stateCode} />
            <ViewField label="Address" value={ret.vendorSnapshot?.address} />
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
                  <th className="px-4 py-3 text-right font-medium">Taxable</th>
                  <th className="px-4 py-3 text-right font-medium">Tax%</th>
                  <th className="px-4 py-3 text-right font-medium">SGST</th>
                  <th className="px-4 py-3 text-right font-medium">CGST</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {ret.items.map((item) => (
                  <tr key={item.slNo} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-400">{item.slNo}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.itemId?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {item.hsn || item.itemId?.hsn || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.uomId?.shortCode ?? "—"}</td>
                    <td className="px-4 py-3 text-right">₹{item.rate.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">{item.qty}</td>
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
                <span className="font-medium">₹ {ret.netAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 text-gray-600">
                <span>Total SGST</span>
                <span>₹ {ret.totalSGST.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 text-gray-600">
                <span>Total CGST</span>
                <span>₹ {ret.totalCGST.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 text-gray-600">
                <span>Total Tax</span>
                <span>₹ {ret.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 font-semibold text-gray-800">
                <span>Total</span>
                <span>₹ {ret.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 text-gray-500">
                <span>Round Off</span>
                <span>
                  {ret.roundOff >= 0 ? "+" : ""}
                  {ret.roundOff.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 text-base font-bold text-gray-900">
                <span>Grand Total</span>
                <span>₹ {ret.grandTotal.toFixed(2)}</span>
              </div>
              <p className="border-t pt-2 text-xs italic text-gray-400">
                {amountInWords(ret.grandTotal)}
              </p>
            </div>
          </div>
        </ViewSection>

        <ViewSection id="references" title="Reference Documents">
          <DocumentAttachmentsView attachments={ret.attachments} />
        </ViewSection>

        <ViewSection id="audit" title="Audit Information">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField
              label="Created"
              value={new Date(ret.createdAt).toLocaleDateString("en-IN", {
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
