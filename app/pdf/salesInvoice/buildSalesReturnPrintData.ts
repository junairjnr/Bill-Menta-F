import type { SalesReturn } from "@/app/types";
import type { CompanySettings } from "@/app/services/settings/settings.service";
import type { SalesInvoicePrintData } from "./types";
import { fmtInvoiceDate, invoiceAmountInWords, orDash } from "./formatters";

type CompanyWithGstin = CompanySettings & { gstin?: string; terms?: string };

type CustomerSnap = NonNullable<SalesReturn["customerSnapshot"]>;

export function buildSalesReturnPrintData(
  ret: SalesReturn,
  company?: CompanyWithGstin | null
): SalesInvoicePrintData {
  const snap: Partial<CustomerSnap> = ret.customerSnapshot ?? {};
  const customerPhone = ret.customerId?.phone ?? "";
  const customerAddressParts = [snap.place, snap.address, snap.state].filter(Boolean);
  const returnDate = fmtInvoiceDate(ret.returnDate);

  return {
    documentType: "return",
    originalInvoiceNo: ret.originalInvoiceNo,
    companyName: orDash(company?.name),
    companyAddress: company?.address ? `Address: ${company.address}` : "Address: —",
    companyGstin: company?.gstin ? `GSTIN: ${company.gstin}` : "GSTIN: —",
    companyEmail: company?.email ? `Email: ${company.email}` : "Email: —",
    companyPhone: company?.phone ? `Phone: ${company.phone}` : "Phone: —",
    invoiceNo: ret.returnNo,
    invoiceDate: returnDate,
    placeOfSupply: orDash(snap.place),
    supplyState: orDash(snap.state),
    supplyStateCode: snap.stateCode ? String(snap.stateCode) : "—",
    transportMode: "—",
    vehicleNumber: "—",
    ewayBillNo: "—",
    dateOfSupply: returnDate,
    customerName: snap.name ?? ret.customerId?.name ?? "—",
    customerAddress: customerAddressParts.length
      ? customerAddressParts.join(", ")
      : "—",
    customerPhone,
    customerGstin: orDash(snap.gstin),
    customerState: orDash(snap.state),
    customerStateCode: snap.stateCode ? String(snap.stateCode) : "—",
    items: ret.items.map((item) => ({
      slNo: item.slNo,
      description: item.itemId?.name ?? "—",
      hsn: item.hsn || item.itemId?.hsn || "—",
      uom: item.uomId?.shortCode || item.uomId?.name || "—",
      rate: item.rate ?? 0,
      qty: item.qty ?? 0,
      discount: item.discount ?? 0,
      taxableValue: item.taxableValue ?? 0,
      cgst: item.cgst ?? 0,
      sgst: item.sgst ?? 0,
      total: item.total ?? 0,
    })),
    lineNetAmount: ret.netAmount ?? 0,
    cashDiscountPercent: 0,
    cashDiscountAmt: 0,
    billTotal: ret.grandTotal ?? 0,
    saleMode: "credit",
    netAmount: ret.netAmount ?? 0,
    totalCGST: ret.totalCGST ?? 0,
    totalSGST: ret.totalSGST ?? 0,
    totalTax: ret.totalTax ?? 0,
    total: ret.total ?? 0,
    roundOff: ret.roundOff ?? 0,
    grandTotal: ret.grandTotal ?? 0,
    amountInWords: invoiceAmountInWords(ret.grandTotal ?? 0),
    terms: company?.terms,
  };
}
