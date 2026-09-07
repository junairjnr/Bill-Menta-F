import type { BankAccount, SalesInvoice } from "@/app/types";
import type { CompanySettings } from "@/app/services/settings/settings.service";
import { resolveCustomerName } from "@/app/utilsComponents/paymentConstants";
import type { SalesInvoicePrintData } from "./types";
import { fmtInvoiceDate, invoiceAmountInWords, orDash } from "./formatters";

type CompanyWithGstin = CompanySettings & { gstin?: string; terms?: string };

export function buildSalesInvoicePrintData(
  invoice: SalesInvoice,
  company?: CompanyWithGstin | null,
  banks: BankAccount[] = []
): SalesInvoicePrintData {
  const customerPopulated =
    invoice.customerId && typeof invoice.customerId === "object"
      ? invoice.customerId
      : null;
  const snap = invoice.customerSnapshot ?? {};
  const customerPhone = customerPopulated?.phone ?? "";

  const customerAddressParts = [
    snap.place,
    snap.address,
    snap.state,
  ].filter(Boolean);

  const defaultBank =
    banks.find((b) => b.isDefault && b.isActive) ??
    banks.find((b) => b.isActive) ??
    banks[0];

  const invoiceDate = fmtInvoiceDate(invoice.invoiceDate);
  const cashDiscountAmt = Number(invoice.cashDiscountAmt ?? 0);
  const grandTotal = invoice.grandTotal ?? 0;
  const billTotal = invoice.billTotal ?? grandTotal + cashDiscountAmt;
  const effectiveCashDiscount =
    cashDiscountAmt > 0
      ? cashDiscountAmt
      : Math.max(0, Number((billTotal - grandTotal).toFixed(2)));

  return {
    companyName: orDash(company?.name),
    companyAddress: company?.address
      ? `Address: ${company.address}`
      : "Address: —",
    companyGstin: company?.gstin ? `GSTIN: ${company.gstin}` : "GSTIN: —",
    companyEmail: company?.email ? `Email: ${company.email}` : "Email: —",
    companyPhone: company?.phone ? `Phone: ${company.phone}` : "Phone: —",
    invoiceNo: invoice.invoiceNo,
    invoiceDate,
    placeOfSupply: orDash(snap.place),
    supplyState: orDash(snap.state),
    supplyStateCode: invoice.placeOfSupplyStateCode
      ? String(invoice.placeOfSupplyStateCode)
      : snap.stateCode
        ? String(snap.stateCode)
        : "—",
    transportMode: "—",
    vehicleNumber: "—",
    ewayBillNo: "—",
    dateOfSupply: invoiceDate,
    customerName: resolveCustomerName(invoice),
    customerAddress: customerAddressParts.length
      ? customerAddressParts.join(", ")
      : "—",
    customerPhone,
    customerGstin: orDash(snap.gstin),
    customerState: orDash(snap.state),
    customerStateCode: snap.stateCode ? String(snap.stateCode) : "—",
    items: invoice.items.map((item: any) => ({
      slNo: item.slNo,
      description:
        typeof item.itemId === "object" ? item.itemId.name : item.description ?? "—",
      hsn: item.hsn || "—",
      uom: typeof item.uomId === "object" ? item.uomId.shortCode || item.uomId.name : "—",
      rate: item.rate ?? 0,
      qty: item.qty ?? 0,
      discount: item.discount ?? 0,
      taxableValue: item.taxableValue ?? 0,
      cgst: item.cgst ?? 0,
      sgst: item.sgst ?? 0,
      igst: item.igst ?? 0,
      total: item.total ?? 0,
    })),
    lineNetAmount:
      invoice.lineNetAmount ??
      invoice.items.reduce(
        (s: number, item: { taxableValue?: number }) => s + (item.taxableValue ?? 0),
        0
      ),
    cashDiscountPercent: invoice.cashDiscountPercent ?? 0,
    cashDiscountAmt: effectiveCashDiscount,
    billTotal,
    saleMode: invoice.saleMode === "cash" ? "cash" : "credit",
    netAmount: invoice.netAmount ?? 0,
    totalCGST: invoice.totalCGST ?? 0,
    totalSGST: invoice.totalSGST ?? 0,
    totalIGST: invoice.totalIGST ?? 0,
    totalTax: invoice.totalTax ?? 0,
    gstSupplyType: invoice.gstSupplyType,
    supplierStateCode: invoice.supplierStateCode,
    total: invoice.total ?? 0,
    roundOff: invoice.roundOff ?? 0,
    grandTotal: invoice.grandTotal ?? 0,
    amountInWords: invoiceAmountInWords(invoice.grandTotal ?? 0),
    bank: defaultBank
      ? {
          bankName: defaultBank.bankName,
          accountName: defaultBank.accountName,
          accountNumber: defaultBank.accountNumber,
          ifscCode: defaultBank.ifscCode || "—",
        }
      : undefined,
    terms: company?.terms,
  };
}
