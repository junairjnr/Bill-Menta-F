import React from "react";
import { pdf } from "@react-pdf/renderer";
import type { BankAccount, SalesInvoice } from "@/app/types";
import type { CompanySettings } from "@/app/services/settings/settings.service";
import SalesTaxInvoicePdf from "./SalesTaxInvoicePdf";
import { buildSalesInvoicePrintData } from "./buildSalesInvoicePrintData";
import { loadBrandLogoDataUrl } from "@/app/config/brand";

type CompanyWithGstin = CompanySettings & { gstin?: string; terms?: string };

export async function printSalesInvoicePdf(
  invoice: SalesInvoice,
  company?: CompanyWithGstin | null,
  banks: BankAccount[] = []
) {
  const data = buildSalesInvoicePrintData(invoice, company, banks);
  data.logoSrc = await loadBrandLogoDataUrl();
  const blob = await pdf(<SalesTaxInvoicePdf data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    URL.revokeObjectURL(url);
    throw new Error("Pop-up blocked. Allow pop-ups to print the invoice.");
  }
  win.onload = () => {
    win.focus();
    win.print();
  };
}

export async function downloadSalesInvoicePdf(
  invoice: SalesInvoice,
  company?: CompanyWithGstin | null,
  banks: BankAccount[] = []
) {
  const data = buildSalesInvoicePrintData(invoice, company, banks);
  data.logoSrc = await loadBrandLogoDataUrl();
  const blob = await pdf(<SalesTaxInvoicePdf data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoice.invoiceNo.replace(/\//g, "-")}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
