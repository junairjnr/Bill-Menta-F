import { pdf } from "@react-pdf/renderer";
import type { SalesReturn } from "@/app/types";
import type { CompanySettings } from "@/app/services/settings/settings.service";
import SalesTaxInvoicePdf from "./SalesTaxInvoicePdf";
import { buildSalesReturnPrintData } from "./buildSalesReturnPrintData";
import { loadBrandLogoDataUrl } from "@/app/config/brand";

type CompanyWithGstin = CompanySettings & { gstin?: string; terms?: string };

export async function printSalesReturnPdf(
  ret: SalesReturn,
  company?: CompanyWithGstin | null
) {
  const data = buildSalesReturnPrintData(ret, company);
  data.logoSrc = await loadBrandLogoDataUrl();
  const blob = await pdf(<SalesTaxInvoicePdf data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    URL.revokeObjectURL(url);
    throw new Error("Pop-up blocked. Allow pop-ups to print the return.");
  }
  win.onload = () => {
    win.focus();
    win.print();
  };
}
