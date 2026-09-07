export interface SalesInvoicePrintItem {
  slNo: number;
  description: string;
  hsn: string;
  uom: string;
  rate: number;
  qty: number;
  discount: number;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst?: number;
  total: number;
}

export interface SalesInvoicePrintBank {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface SalesInvoicePrintData {
  logoSrc?: string;
  documentType?: "invoice" | "return";
  originalInvoiceNo?: string;
  companyName: string;
  companyAddress: string;
  companyGstin: string;
  companyEmail: string;
  companyPhone: string;
  invoiceNo: string;
  invoiceDate: string;
  placeOfSupply: string;
  supplyState: string;
  supplyStateCode: string;
  transportMode: string;
  vehicleNumber: string;
  ewayBillNo: string;
  dateOfSupply: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerGstin: string;
  customerState: string;
  customerStateCode: string;
  items: SalesInvoicePrintItem[];
  lineNetAmount: number;
  cashDiscountPercent: number;
  cashDiscountAmt: number;
  billTotal: number;
  saleMode: "credit" | "cash";
  netAmount: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST?: number;
  totalTax: number;
  gstSupplyType?: "intra" | "inter";
  supplierStateCode?: string;
  total: number;
  roundOff: number;
  grandTotal: number;
  amountInWords: string;
  bank?: SalesInvoicePrintBank;
  terms?: string;
}
