"use client";

import { useParams, useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewPageHeader from "@/app/utilsComponents/ViewPageHeader";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import { useQuotation } from "@/app/hooks/salesHooks/useQuotation";
import { amountInWords } from "@/app/utilsComponents/AmountInWords";
import { footerPrimaryBtn } from "@/app/utilsComponents/form-footer";
import {
  invoiceItemsTableClass,
  invoiceViewSummaryPanelClass,
  invoiceSummaryGrandTotalClass,
} from "@/app/utilsComponents/report-ui";
import { resolveCustomerName } from "@/app/utilsComponents/paymentConstants";
import { gstSupplyTypeLabel } from "@/app/utils/gstTax";

const TABS = [
  { key: "quotation", label: "Quotation Info" },
  { key: "customer", label: "Customer" },
  { key: "items", label: "Items" },
  { key: "summary", label: "Summary" },
  { key: "audit", label: "Audit" },
];

const QUOTATION_STATUS_STYLES: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-700",
  sent: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  converted: "bg-purple-100 text-purple-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function QuotationViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: quotation, isLoading, isError } = useQuotation(id);

  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError || !quotation) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load quotation.</p>
        </div>
      </BackPanel>
    );
  }

  const lineNetAmount =
    quotation.lineNetAmount ??
    quotation.items.reduce(
      (s: number, item: { taxableValue?: number }) =>
        s + (item.taxableValue ?? 0),
      0
    );
  const cashDiscountAmt = quotation.cashDiscountAmt ?? 0;
  const billTotal = quotation.billTotal ?? quotation.grandTotal + cashDiscountAmt;
  const hasTax = (quotation.totalTax ?? 0) > 0;
  const isInterState = quotation.gstSupplyType === "inter";
  const totalIGST = quotation.totalIGST ?? 0;

  const canConvert =
    quotation.status !== "converted" && quotation.status !== "cancelled";

  const customerPopulated =
    quotation.customerId && typeof quotation.customerId === "object"
      ? (quotation.customerId as {
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
  const customerSnap = quotation.customerSnapshot ?? {};
  const customerDetails = {
    name: resolveCustomerName(quotation),
    gstin: customerSnap.gstin || customerPopulated?.gstin || "—",
    place: customerSnap.place || customerPopulated?.address?.place || "—",
    state: customerSnap.state || customerPopulated?.address?.state || "—",
    stateCode:
      customerSnap.stateCode || customerPopulated?.address?.stateCode || "—",
    address:
      customerSnap.address ||
      [
        customerPopulated?.address?.line1,
        customerPopulated?.address?.place,
        customerPopulated?.address?.city,
      ]
        .filter(Boolean)
        .join(", ") ||
      "—",
  };

  return (
    <BackPanel
      tabs={TABS}
      buttons={[
        ...(canConvert
          ? [
              {
                label: "Convert to Invoice",
                onClick: () =>
                  router.push(
                    `/sales/salesInvoice/add?quotationId=${quotation._id}`
                  ),
                icon: <FileText size={14} />,
                className: footerPrimaryBtn,
              },
            ]
          : []),
        ...(quotation.status === "converted" && quotation.convertedToInvoiceId
          ? [
              {
                label: "View Invoice",
                onClick: () =>
                  router.push(
                    `/sales/salesInvoice/${quotation.convertedToInvoiceId}`
                  ),
                icon: <FileText size={14} />,
                className: footerPrimaryBtn,
              },
            ]
          : []),
      ]}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <ViewPageHeader
            title={quotation.quotationNo}
            subtitle={new Date(quotation.quotationDate).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          />
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              quotation.salesType === "retail"
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {quotation.salesType.charAt(0).toUpperCase() +
              quotation.salesType.slice(1)}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              QUOTATION_STATUS_STYLES[quotation.status] ??
              "bg-gray-100 text-gray-600"
            }`}
          >
            {quotation.status.charAt(0).toUpperCase() +
              quotation.status.slice(1)}
          </span>
        </div>

        <ViewSection id="quotation" title="Quotation Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ViewField label="Quotation No" value={quotation.quotationNo} />
            <ViewField
              label="Quotation Date"
              value={new Date(quotation.quotationDate).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            />
            <ViewField
              label="Valid Until"
              value={
                quotation.validUntil
                  ? new Date(quotation.validUntil).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "—"
              }
            />
            <ViewField
              label="Sales Type"
              value={
                quotation.salesType.charAt(0).toUpperCase() +
                quotation.salesType.slice(1)
              }
              badge
              badgeColor={quotation.salesType === "retail" ? "blue" : "gray"}
            />
            <ViewField
              label="Price Level"
              value={
                quotation.priceLevelSnapshot?.name
                  ? `${quotation.priceLevelSnapshot.name} (${quotation.priceLevelSnapshot.taxPercent}%)`
                  : "—"
              }
            />
            <ViewField
              label="Warehouse"
              value={
                quotation.warehouseId && typeof quotation.warehouseId === "object"
                  ? quotation.warehouseId.name
                  : "—"
              }
            />
            <ViewField
              label="Status"
              value={
                quotation.status.charAt(0).toUpperCase() +
                quotation.status.slice(1)
              }
              badge
              badgeColor={
                quotation.status === "accepted" || quotation.status === "sent"
                  ? "green"
                  : quotation.status === "converted"
                    ? "blue"
                    : quotation.status === "draft"
                      ? "yellow"
                      : "red"
              }
            />
            {cashDiscountAmt > 0 ? (
              <ViewField
                label="Cash Discount"
                value={`₹ ${cashDiscountAmt.toFixed(2)}`}
              />
            ) : null}
            {quotation.notes && (
              <ViewField label="Notes" value={quotation.notes} />
            )}
          </div>
        </ViewSection>

        <ViewSection id="customer" title="Customer Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ViewField label="Customer Name" value={customerDetails.name} />
            <ViewField label="GSTIN" value={customerDetails.gstin} />
            <ViewField
              label="Supplier State Code"
              value={quotation.supplierStateCode || "—"}
            />
            <ViewField label="Place of Supply" value={customerDetails.place} />
            <ViewField
              label="Place of Supply State"
              value={customerDetails.state}
            />
            <ViewField
              label="Place of Supply State Code"
              value={
                quotation.placeOfSupplyStateCode || customerDetails.stateCode
              }
            />
            {quotation.gstSupplyType && (
              <ViewField
                label="GST Supply Type"
                value={gstSupplyTypeLabel(quotation.gstSupplyType)}
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
                <th className="px-4 py-3 text-right font-medium">
                  Taxable Value
                </th>
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
              {quotation.items.map((item: any, i: number) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-400">{item.slNo}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {typeof item.itemId === "object" ? item.itemId.name : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.hsn || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {typeof item.uomId === "object"
                      ? item.uomId.shortCode
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">
                    ₹{item.baseRate.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    ₹{item.rate.toFixed(2)}
                    <span className="ml-1 text-xs text-green-600">
                      +{item.priceLevelPct}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{item.qty}</td>
                  <td className="px-4 py-3 text-right text-gray-500">
                    {item.discount > 0 ? `${item.discount}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    ₹{item.taxableValue.toFixed(2)}
                  </td>
                  {hasTax &&
                    (isInterState ? (
                      <td className="px-4 py-3 text-right">
                        ₹{(item.igst ?? 0).toFixed(2)}
                      </td>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-right">
                          ₹{item.sgst.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          ₹{item.cgst.toFixed(2)}
                        </td>
                      </>
                    ))}
                  <td className="px-4 py-3 text-right font-semibold">
                    ₹{item.total.toFixed(2)}
                  </td>
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
                <span className="font-medium">
                  ₹ {lineNetAmount.toFixed(2)}
                </span>
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
                        <span>₹ {quotation.totalSGST.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-b py-1.5 text-gray-600">
                        <span>Total CGST</span>
                        <span>₹ {quotation.totalCGST.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between border-b py-1.5 text-gray-600">
                    <span>Total Tax Amount</span>
                    <span>₹ {quotation.totalTax.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between border-b py-1.5 font-semibold text-gray-800">
                <span>Total</span>
                <span>₹ {quotation.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 text-gray-500">
                <span>Round Off</span>
                <span>
                  {quotation.roundOff >= 0 ? "+" : ""}
                  {quotation.roundOff.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-b py-1.5 font-semibold text-gray-800">
                <span>Bill Total</span>
                <span>₹ {billTotal.toFixed(2)}</span>
              </div>
              <div className={invoiceSummaryGrandTotalClass}>
                <span>Amount to Collect</span>
                <span>₹ {quotation.grandTotal.toFixed(2)}</span>
              </div>
              <p className="border-t pt-2 text-xs italic text-gray-400">
                {amountInWords(quotation.grandTotal)}
              </p>
            </div>
          </div>
        </ViewSection>

        <ViewSection id="audit" title="Audit Information">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField
              label="Created"
              value={new Date(quotation.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            />
            {quotation.convertedAt && (
              <ViewField
                label="Converted At"
                value={new Date(quotation.convertedAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              />
            )}
          </div>
        </ViewSection>
      </div>
    </BackPanel>
  );
}
