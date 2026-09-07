// ── API Wrapper ───────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  limit?: number;
  totalPages: number;
  hasNext: boolean;
  summary?: {
    count: number;
    totalAmount: number;
  };
}
// ── Query Params ──────────────────────────────────────────────
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  [key: string]: any;
}

// ── Auth ──────────────────────────────────────────────────────
import type { UserPermissions, PermissionAction } from "../config/permissions";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  companyName: string;
  companyEmail: string;
  name: string;
  email: string;
  password: string;
}

export type UserRole = string;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  branchId?: Branch | string;
  permissions?: UserPermissions;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  company?: {
    _id: string;
    name: string;
    email: string;
  };
}

// ── User ──────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  companyId: string;
  branchId?: Branch | string;
  createdAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  branchId?: string;
}

export interface UpdateUserPayload {
  name?: string;
  role?: UserRole;
  branchId?: string;
  isActive?: boolean;
  password?: string;
}

export interface InviteUserPayload {
  name: string;
  email: string;
  role: UserRole;
}

// ── Settings: Roles & Permissions ─────────────────────────────
export interface PermissionCatalogItem {
  key: string;
  label: string;
  group: string;
}

export interface PermissionSection {
  title: string;
  resources: { key: string; label: string }[];
}

export interface RolePermissionsResponse {
  roles: string[];
  roleMeta?: Record<string, { label: string; description: string }>;
  actions: PermissionAction[];
  sections: PermissionSection[];
  permissions: PermissionCatalogItem[];
  permissionsByRole: Record<string, Record<string, boolean>>;
}

export interface RoleListItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  isSystem: boolean;
  basedOn?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RolesResponse {
  systemRoles: RoleListItem[];
  customRoles: RoleListItem[];
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  basedOn?: string;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
}

export interface CompanySettings {
  _id: string;
  name: string;
  code?: string;
  email: string;
  phone?: string;
  address?: string;
  gstin?: string;
  terms?: string;
  logo?: string;
  plan?: "free" | "pro" | "enterprise";
  isActive?: boolean;
}

//Branch
export interface Branch {
  _id: string;
  name: string;
  code: string;
  isHeadOffice: boolean;
  isActive: boolean;
  phone?: string;
  email?: string;
  gstin?: string;
  address?: {
    line1?: string;
    place?: string;
    city?: string;
    state?: string;
    stateCode?: string;
    pincode?: string;
  };
}

export interface CreateBranchPayload {
  name: string;
  code: string;
  phone?: string;
  email?: string;
  gstin?: string;
  isHeadOffice: boolean;
  address?: {
    line1?: string;
    place?: string;
    city?: string;
    state?: string;
    stateCode?: string;
    pincode?: string;
  };
}

// ── Financial Year ─────────────────────────────────────────────
export interface FY {
  _id: string;
  label: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isClosed: boolean;
}

// ── Masters ───────────────────────────────────────────────────

// ITEM CATEGORY
export interface ItemCategory {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateItemCategoryPayload {
  name: string;
  description?: string;
}
// ITEM

export interface Item {
  _id: string;
  name: string;
  code?: string;
  hsnCode?: string;
  uomId: {
    _id: string;
    name: string;
    shortCode: string;
  };
  salesRate?: number;
  purchaseRate?: number;
  price: number;
  taxPercent: number;
  categoryId: {
    _id: string;
    name: string;
  };
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateItemPayload {
  name: string;
  code?: string;
  hsnCode?: string;
  salesRate: number;
  purchaseRate: number;
  price: number; // kept in sync with salesRate for backward compatibility
  taxPercent: number; // ← number not string
  categoryId: string; // ← string (ObjectId) not number
  uomId: string; // ← string (ObjectId)
  description?: string;
  isActive: boolean;
}

// CUSTOMER
export interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  gstin?: string;
  customerType: "retail" | "wholesale";
  creditLimit: number;
  type: "sales" | "purchase";
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    place?: string;
    state?: string;
    pincode?: string;
    country?: string;
    stateCode?: string;
  };
  isActive: boolean;
  createdAt: string;
}

export interface CreateCustomerPayload {
  name: string;
  email?: string;
  phone?: string;
  gstin?: string;
  customerType: "retail" | "wholesale";
  creditLimit?: number;
  address?: Customer["address"];
}

// UOM

export interface Uom {
  _id: string;
  name: string;
  shortCode: string;
  type: "weight" | "length" | "volume" | "quantity" | "time" | "other";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface CreateUomPayload {
  name: string;
  shortCode: string;
  isActive: boolean;
}

//PRICELEVEL

export interface PriceLevel {
  _id: string;
  name: string;
  taxPercent?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePriceLevelPayload {
  name: string;
  taxPercent?: string;
  isActive: boolean;
}

// WAREHOUSE

export interface Warehouse {
  _id: string;
  companyId: string;
  branchId: { _id: string; name: string; code: string } | string;
  name: string;
  code: string;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface CreateWarehousePayload {
  // branchId: string;
  name: string;
  code: string;
  description?: string;
  isDefault: boolean;
}

// STOCK

export interface Stock {
  _id: string;
  itemId: { _id: string; name: string; code?: string };
  warehouseId: { _id: string; name: string; code: string };
  financialYearId: string;
  qty: number;
  avgCost: number;
}

export interface StockLedger {
  _id: string;
  itemId: { _id: string; name: string };
  warehouseId: { _id: string; name: string };
  movementType: string;
  qty: number;
  rate: number;
  value: number;
  balanceQty: number;
  referenceType?: string;
  referenceNo?: string;
  linkedWarehouseId?: { _id: string; name: string };
  notes?: string;
  createdAt: string;
}

//  PURCHASE

export interface DocumentAttachment {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt?: string;
}

export interface PurchaseItem {
  slNo: number;
  itemId: string;
  hsn: string;
  uomId: string;
  rate: number;
  qty: number;
  discount?: number;
  discountAmt?: number;
  taxableValue: number;
  taxPercent: number;
  sgst: number;
  cgst: number;
  total: number;
}

export interface PurchaseItemRow {
  slNo: number;
  itemId: string;
  itemName: string;
  hsn: string;
  uomId: string;
  uomName: string;
  rate: string;
  qty: string;
  discount: string;
  discountAmt: number;
  taxableValue: number;
  taxPercent: number;
  sgst: number;
  cgst: number;
  total: number;
}

export interface CreatePurchasePayload {
  vendorId: string;
  vendorInvoiceNo: string;
  purchaseDate: string;
  warehouseId: string;
  items: PurchaseItem[];
  notes?: string;
  attachments?: DocumentAttachment[];
}

export interface PurchaseInvoice {
  _id: string;
  invoiceNo: string;
  vendorInvoiceNo: string;
  purchaseDate: string;
  vendorId: { _id: string; name: string; phone: string };
  vendorSnapshot: {
    name: string;
    gstin: string;
    place: string;
    state: string;
    stateCode: string;
    address: string;
  };
  warehouseId: { _id: string; name: string; code: string };
  items: PurchaseItem[];
  netAmount: number;
  totalSGST: number;
  totalCGST: number;
  totalTax: number;
  total: number;
  roundOff: number;
  grandTotal: number;
  paidAmount?: number;
  balanceAmount?: number;
  paymentStatus?: PaymentStatus;
  status: string;
  createdAt: string;
  notes?: string;
  attachments?: DocumentAttachment[];
}

// ── Sales Invoice Item Row (for form state) ───────────────────
export interface SalesItemRow {
  slNo: number;
  itemId: string;
  itemName: string;
  hsn: string;
  uomId: string;
  uomName: string;
  baseRate: number; // item.price
  priceLevelPct: number; // priceLevel.taxPercent
  rate: number; // baseRate + (baseRate * priceLevelPct/100)
  qty: string;
  discount: string; // percentage
  discountAmt: number; // calculated
  taxableValue: number; // calculated
  taxPercent: number; // from product GST %
  sgst: number;
  cgst: number;
  igst?: number;
  total: number; // taxableValue + sgst + cgst + igst
}

export type PaymentMode =
  | "cash"
  | "cheque"
  | "bank_transfer"
  | "bank"
  | "upi"
  | "card"
  | "other";
export type PaymentStatus = "pending" | "partial" | "paid" | "unpaid";
export type VoucherType = "receipt" | "payment";

// ── Sales Invoice ─────────────────────────────────────────────
export interface SalesInvoice {
  _id: string;
  invoiceNo: string;
  invoiceDate: string;
  salesType: "retail" | "wholesale";
  priceLevelId: { _id: string; name: string; taxPercent: number };
  priceLevelSnapshot: { name: string; taxPercent: number };
  customerId: { _id: string; name: string; phone: string };
  customerSnapshot: {
    name: string;
    gstin: string;
    place: string;
    state: string;
    stateCode: string;
    address: string;
  };
  warehouseId: { _id: string; name: string; code: string };
  items: any[];
  netAmount: number;
  totalSGST: number;
  totalCGST: number;
  totalIGST?: number;
  totalTax: number;
  total: number;
  roundOff: number;
  grandTotal: number;
  supplierStateCode?: string;
  placeOfSupplyStateCode?: string;
  gstSupplyType?: "intra" | "inter";
  paidAmount?: number;
  balanceAmount?: number;
  paymentStatus?: PaymentStatus;
  lineNetAmount?: number;
  cashDiscountPercent?: number;
  cashDiscountAmt?: number;
  billTotal?: number;
  saleMode?: "credit" | "cash";
  status: string;
  notes?: string;
  createdAt: string;
}

export interface CreateSalesPayload {
  invoiceDate: string;
  salesType: "retail" | "wholesale";
  priceLevelId: string;
  customerId: string;
  warehouseId: string;
  items: any[];
  notes?: string;
  cashDiscountPercent?: number;
  cashDiscountAmt?: number;
  saleMode?: "credit" | "cash";
  paidAmount?: number;
}

// ── Purchase Return ───────────────────────────────────────────
export interface ReturnableItem {
  invoiceItemId: string;
  slNo: number;
  itemId: string;
  hsn?: string;
  uomId: string;
  rate: number;
  discount?: number;
  originalQty: number;
  returnedQty: number;
  returnableQty: number;
}

export interface PurchaseReturnableData {
  purchaseInvoiceId: string;
  invoiceNo: string;
  vendorInvoiceNo?: string;
  vendorId: string;
  warehouseId: string;
  grandTotal: number;
  returnedAmount: number;
  items: ReturnableItem[];
}

export interface CreatePurchaseReturnItem {
  invoiceItemId?: string;
  itemId?: string;
  qty: number;
  rate?: number;
  taxPercent?: number;
}

export interface CreatePurchaseReturnPayload {
  returnMode?: "invoice" | "manual";
  purchaseInvoiceId?: string;
  returnDate: string;
  vendorId?: string;
  warehouseId?: string;
  referenceInvoiceNo?: string;
  vendorInvoiceNo?: string;
  items: CreatePurchaseReturnItem[];
  notes?: string;
  attachments?: DocumentAttachment[];
}

export interface PurchaseReturnItem {
  slNo: number;
  invoiceItemId: string;
  itemId: { _id: string; name: string; code?: string; hsn?: string };
  hsn?: string;
  uomId: { _id: string; name: string; shortCode: string };
  rate: number;
  qty: number;
  taxPercent: number;
  taxableValue: number;
  sgst: number;
  cgst: number;
  total: number;
}

export interface PurchaseReturn {
  _id: string;
  returnNo: string;
  returnDate: string;
  returnMode?: "invoice" | "manual";
  purchaseInvoiceId?:
    | string
    | { _id: string; invoiceNo: string; vendorInvoiceNo?: string; purchaseDate?: string };
  originalInvoiceNo: string;
  referenceInvoiceNo?: string;
  vendorInvoiceNo?: string;
  vendorId: { _id: string; name: string; phone?: string };
  vendorSnapshot?: {
    name: string;
    gstin?: string;
    place?: string;
    state?: string;
    stateCode?: string;
    address?: string;
  };
  warehouseId: { _id: string; name: string; code: string };
  items: PurchaseReturnItem[];
  netAmount: number;
  totalSGST: number;
  totalCGST: number;
  totalTax: number;
  total: number;
  roundOff: number;
  grandTotal: number;
  status: string;
  notes?: string;
  attachments?: DocumentAttachment[];
  createdAt: string;
}
export interface SalesReturnableData {
  salesInvoiceId: string;
  invoiceNo: string;
  salesType: "retail" | "wholesale";
  customerId: string;
  warehouseId: string;
  grandTotal: number;
  returnedAmount: number;
  items: ReturnableItem[];
}

export interface CreateSalesReturnItem {
  invoiceItemId?: string;
  itemId?: string;
  qty: number;
  rate?: number;
  discount?: number;
}

export interface CreateSalesReturnPayload {
  returnMode?: "invoice" | "manual";
  salesInvoiceId?: string;
  returnDate: string;
  customerId?: string;
  warehouseId?: string;
  salesType?: "retail" | "wholesale";
  priceLevelId?: string;
  referenceInvoiceNo?: string;
  items: CreateSalesReturnItem[];
  notes?: string;
}

export interface SalesReturnItem {
  slNo: number;
  invoiceItemId: string;
  itemId: { _id: string; name: string; code?: string; hsn?: string };
  hsn?: string;
  uomId: { _id: string; name: string; shortCode: string };
  baseRate: number;
  priceLevelPct: number;
  rate: number;
  qty: number;
  discount: number;
  discountAmt: number;
  taxableValue: number;
  sgst: number;
  cgst: number;
  total: number;
}

export interface SalesReturn {
  _id: string;
  returnNo: string;
  returnDate: string;
  returnMode?: "invoice" | "manual";
  salesInvoiceId?:
    | string
    | { _id: string; invoiceNo: string; invoiceDate?: string; grandTotal?: number; returnedAmount?: number };
  originalInvoiceNo: string;
  referenceInvoiceNo?: string;
  salesType: "retail" | "wholesale";
  priceLevelId?: { _id: string; name: string; taxPercent: number };
  priceLevelSnapshot?: { name: string; taxPercent: number };
  customerId: { _id: string; name: string; phone?: string };
  customerSnapshot?: {
    name: string;
    gstin?: string;
    place?: string;
    state?: string;
    stateCode?: string;
    address?: string;
  };
  warehouseId: { _id: string; name: string; code: string };
  items: SalesReturnItem[];
  netAmount: number;
  totalSGST: number;
  totalCGST: number;
  totalTax: number;
  total: number;
  roundOff: number;
  grandTotal: number;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface BankAccountSnapshot {
  accountName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
}

export interface BankAccount {
  _id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode?: string;
  branch?: string;
  accountType: "current" | "savings" | "overdraft";
  upiId?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface CreateBankAccountPayload {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode?: string;
  branch?: string;
  accountType: string;
  upiId?: string;
  isDefault: boolean;
}

// ── Outstanding Invoice (for payment form) ────────────────────
export interface OutstandingInvoice {
  _id: string;
  invoiceNo: string;
  invoiceDate: string;
  createdAt?: string;
  grandTotal: number;
  returnedAmount?: number;
  effectiveTotal?: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
}

export interface PartyInvoiceSummary {
  invoiceCount: number;
  totalAmount: number;
  totalPaid: number;
  totalOutstanding: number;
}

export interface OutstandingInvoicesResponse {
  invoices: OutstandingInvoice[];
  summary: PartyInvoiceSummary;
}

// ── Allocation row in form ────────────────────────────────────
export interface AllocationRow {
  invoiceId: string;
  invoiceNo: string;
  invoiceDate: string;
  createdAt?: string;
  invoiceTotal: number;
  paidBefore: number;
  balance: number;
  allocated: string; // string for input, converted on submit
}

// ── Payment ───────────────────────────────────────────────────
export interface Payment {
  _id: string;
  receiptNo: string;
  receiptDate: string;
  customerId: { _id: string; name: string; phone: string };
  customerSnapshot: {
    name: string;
    phone: string;
    gstin: string;
    place: string;
    state: string;
    stateCode: string;
    address: string;
  };
  amount: number;
  paymentMode: PaymentMode;
  bankAccountSnapshot?: BankAccountSnapshot;
  referenceNo?: string;
  allocations: {
    invoiceId: string;
    invoiceNo: string;
    invoiceDate: string;
    invoiceTotal: number;
    paidBefore: number;
    allocated: number;
    balanceAfter: number;
  }[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentPayload {
  receiptDate: string;
  customerId: string;
  amount: number;
  paymentMode: PaymentMode;
  bankAccountId?: string;
  referenceNo?: string;
  allocations: { invoiceId: string; allocated: number }[];
  notes?: string;
}

export interface ReceiptPaymentAllocation {
  invoiceId: string;
  invoiceNo: string;
  invoiceDate: string;
  invoiceTotal: number;
  paidBefore: number;
  amountAdjusted: number;
  balanceAfter: number;
  invoiceType?: "sales" | "purchase";
}

export interface ReceiptPayment {
  _id: string;
  voucherNo: string;
  voucherType: VoucherType;
  date: string;
  partyType: "customer" | "vendor";
  partyId: { _id: string; name: string; phone?: string } | string;
  partySnapshot?: {
    name: string;
    phone?: string;
    gstin?: string;
    place?: string;
    state?: string;
    stateCode?: string;
    address?: string;
  };
  paymentMode: PaymentMode;
  bankAccountId?: string;
  bankAccountSnapshot?: BankAccountSnapshot;
  referenceNo?: string;
  totalAmount: number;
  allocations: ReceiptPaymentAllocation[];
  notes?: string;
  status: "draft" | "completed" | "cancelled";
  allocationCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReceiptPaymentPayload {
  date: string;
  customerId?: string;
  vendorId?: string;
  paymentMode: PaymentMode;
  bankAccountId?: string;
  referenceNo?: string;
  totalAmount: number;
  allocations: { invoiceId: string; amountAdjusted: number }[];
  notes?: string;
}

// ___ REPORT SECTION STARTS HERE

// ── Stock Report ──────────────────────────────────────────────
export interface StockReportRow {
  _id: string;
  itemId: {
    _id: string;
    name: string;
    code?: string;
    hsn?: string;
    categoryId: { _id: string; name: string };
  };
  uomId: { _id: string; name: string; shortCode: string };
  warehouseId: { _id: string; name: string; code: string };
  qty: number;
  avgCost: number;
  rate: number;
  stockValue: number;
  sgst: number;
  cgst: number;
}

export interface StockReportSummary {
  totalItems: number;
  totalStockValue: number;
  totalQty?: number;
  totalSGST?: number;
  totalCGST?: number;
}

// ── Purchase Report ───────────────────────────────────────────
export interface PurchaseReportRow {
  _id: string;
  invoiceNo: string;
  vendorInvoiceNo: string;
  purchaseDate: string;
  vendorId: { _id: string; name: string };
  vendorSnapshot: { name: string };
  warehouseId: { _id: string; name: string };
  items: any[];
  netAmount: number;
  totalSGST: number;
  totalCGST: number;
  totalTax: number;
  grandTotal: number;
  status: string;
}

export interface PurchaseReportSummary {
  totalInvoices: number;
  totalNetAmount: number;
  totalSGST: number;
  totalCGST: number;
  totalTax: number;
  grandTotal: number;
}

// ── Sales Report ──────────────────────────────────────────────
export interface SalesReportRow {
  _id: string;
  invoiceNo: string;
  invoiceDate: string;
  salesType: string;
  customerId: { _id: string; name: string };
  customerSnapshot: { name: string };
  warehouseId: { _id: string; name: string };
  priceLevelSnapshot: { name: string; taxPercent: number };
  netAmount: number;
  totalSGST: number;
  totalCGST: number;
  totalTax: number;
  grandTotal: number;
  status: string;
}

export interface SalesReportSummary {
  totalInvoices: number;
  retailCount: number;
  wholesaleCount: number;
  totalNetAmount: number;
  totalSGST: number;
  totalCGST: number;
  totalTax: number;
  grandTotal: number;
}

// ── Ledger Report ─────────────────────────────────────────────
export interface LedgerReportRow {
  _id: string;
  itemId: { _id: string; name: string; code?: string };
  warehouseId: { _id: string; name: string; code: string };
  uomId: { _id: string; name: string; shortCode: string };
  movementType: string;
  qty: number;
  rate: number;
  value: number;
  balanceQty: number;
  referenceType?: string;
  referenceNo?: string;
  linkedWarehouseId?: { _id: string; name: string };
  notes?: string;
  createdAt: string;
}

export interface LedgerReportSummary {
  totalMovements: number;
  totalIn: number;
  totalOut: number;
  totalValue: number;
}

// ── Generic Report Response ───────────────────────────────────
export interface ReportResponse<T, S> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  summary: S;
}


// ── Shop Report (Party Ledger) ─────────────────────────────
export type ShopReportEntryType =
  | "sales"
  | "sales_return"
  | "purchase"
  | "purchase_return"
  | "receipt"
  | "payment";

export interface ShopReportEntry {
  date: string;
  type: ShopReportEntryType;
  refNo: string;
  partyName?: string;
  partyType?: "customer" | "vendor";
  salesType?: string;
  debit: number;
  credit: number;
  balance?: number | null;
  status?: string;
  paymentMode?: string;
  _id: string;
}

export interface ShopReportSummary {
  totalDebit: number;
  totalCredit: number;
  outstanding: number;
}

// ── Purchase History ──────────────────────────────────────────
export interface PurchaseHistoryRow {
  _id:          string;
  invoiceNo:    string;
  invoiceId:    string;
  purchaseDate: string;
  vendor:       { name: string; phone?: string };
  warehouse:    { name: string; code: string };
  itemId?:      string;
  itemName?:    string;
  hsn:          string;
  qty:          number;
  rate:         number;
  taxableValue: number;
  sgst:         number;
  cgst:         number;
  total:        number;
  taxPercent:   number;
}

export interface PurchaseHistorySummary {
  totalBills:   number;
  totalQty:     number;
  totalValue:   number;
  totalTaxable: number;
  totalSGST?:   number;
  totalCGST?:   number;
  avgRate:      number;
  minRate:      number;
  maxRate:      number;
}

// ── Sales History ─────────────────────────────────────────────
export interface SalesHistoryRow {
  _id:           string;
  invoiceNo:     string;
  invoiceId:     string;
  invoiceDate:   string;
  salesType:     string;
  customer:      { name: string; phone?: string };
  priceLevel:    { name: string; taxPercent: number };
  warehouse:     { name: string; code: string };
  itemId?:       string;
  itemName?:     string;
  hsn:           string;
  baseRate:      number;
  priceLevelPct: number;
  rate:          number;
  qty:           number;
  discount:      number;
  discountAmt:   number;
  taxableValue:  number;
  sgst:          number;
  cgst:          number;
  total:         number;
}

export interface SalesHistorySummary {
  totalBills:    number;
  retailBills:   number;
  wholesaleBills:number;
  totalQty:      number;
  totalValue:    number;
  totalTaxable:  number;
  totalSGST?:    number;
  totalCGST?:    number;
  totalDiscount: number;
  avgRate:       number;
  minRate:       number;
  maxRate:       number;
}

export interface SalesReturnHistoryRow {
  _id: string;
  returnNo: string;
  returnId: string;
  returnDate: string;
  originalInvoiceNo: string;
  salesType: string;
  customer: { name: string; phone?: string };
  priceLevel?: { name: string; taxPercent: number };
  warehouse: { name: string; code: string };
  itemId?: string;
  itemName?: string;
  hsn: string;
  baseRate: number;
  priceLevelPct: number;
  rate: number;
  qty: number;
  discount: number;
  discountAmt: number;
  taxableValue: number;
  sgst: number;
  cgst: number;
  total: number;
}

export interface SalesReturnHistorySummary {
  totalReturns: number;
  retailReturns: number;
  wholesaleReturns: number;
  totalQty: number;
  totalValue: number;
  totalTaxable: number;
  totalSGST?: number;
  totalCGST?: number;
  avgRate: number;
}

export interface PurchaseReturnHistoryRow {
  _id: string;
  returnNo: string;
  returnId: string;
  returnDate: string;
  originalInvoiceNo: string;
  vendorInvoiceNo?: string;
  vendor: { name: string; phone?: string };
  warehouse: { name: string; code: string };
  itemId?: string;
  itemName?: string;
  hsn: string;
  qty: number;
  rate: number;
  taxableValue: number;
  sgst: number;
  cgst: number;
  total: number;
}

export interface PurchaseReturnHistorySummary {
  totalReturns: number;
  totalQty: number;
  totalValue: number;
  totalTaxable: number;
  totalSGST?: number;
  totalCGST?: number;
  avgRate: number;
}

// ── Expense ───────────────────────────────────────────────────
export interface Expense {
  _id: string;
  expenseNo: string;
  date: string;
  category: string;
  title: string;
  amount: number;
  paymentMode: string;
  referenceNo?: string;
  notes?: string;
  status: string;
}

export interface CreateExpensePayload {
  date: string;
  category: string;
  title: string;
  amount: number;
  paymentMode: string;
  referenceNo?: string;
  notes?: string;
}

export interface ExpenseReportRow {
  _id: string;
  expenseNo: string;
  date: string;
  category: string;
  title: string;
  amount: number;
  paymentMode: string;
  referenceNo?: string;
  status: string;
}

export interface ExpenseReportSummary {
  totalAmount: number;
  count: number;
}