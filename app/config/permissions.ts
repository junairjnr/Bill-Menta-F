export type ViewPermissionKey =
  | "dashboard"
  | "master.product"
  | "master.customer"
  | "master.category"
  | "master.uom"
  | "master.priceLevel"
  | "master.branch"
  | "master.financialYear"
  | "master.warehouse"
  | "master.bank"
  | "sales.invoice"
  | "sales.return"
  | "purchase.invoice"
  | "purchase.return"
  | "receipt.voucher"
  | "payment.voucher"
  | "reports.stock"
  | "reports.sales"
  | "reports.purchase"
  | "reports.shop"
  | "reports.purchaseHistory"
  | "reports.salesHistory"
  | "reports.salesReturnHistory"
  | "reports.purchaseReturnHistory"
  | "expense.voucher"
  | "reports.expense"
  | "accounting.entries"
  | "accounting.customerBalance"
  | "accounting.subLedgers"
  | "accounting.trialBalance"
  | "accounting.profitLoss"
  | "accounting.balanceSheet"
  | "accounting.chartOfAccounts"
  | "accounting.manualJournal"
  | "settings.company"
  | "settings.users"
  | "settings.roles"
  | "settings.permissions";

export type UserRole = string;

export interface UserPermissions {
  role: UserRole;
  isSuperAdmin?: boolean;
  [key: string]: boolean | string | undefined;
}

export const PATH_PERMISSION_MAP: Record<string, ViewPermissionKey> = {
  "/dashboard": "dashboard",
  "/master/product": "master.product",
  "/master/customer": "master.customer",
  "/master/category": "master.category",
  "/master/uom": "master.uom",
  "/master/priceLevel": "master.priceLevel",
  "/master/branch": "master.branch",
  "/master/financialYear": "master.financialYear",
  "/master/warehouse": "master.warehouse",
  "/master/bank": "master.bank",
  "/sales/salesInvoice": "sales.invoice",
  "/sales/salesReturn": "sales.return",
  "/purchase/purchaseInvoice": "purchase.invoice",
  "/purchase/purchaseReturn": "purchase.return",
  "/reciept/payments": "receipt.voucher",
  "/payment/vendor-payments": "payment.voucher",
  "/reports/stockReport": "reports.stock",
  "/reports/salesReport": "reports.sales",
  "/reports/purchaseReport": "reports.purchase",
  "/reports/shop": "reports.shop",
  "/reports/purchaseHistory": "reports.purchaseHistory",
  "/reports/salesHistory": "reports.salesHistory",
  "/reports/salesReturnHistory": "reports.salesReturnHistory",
  "/reports/purchaseReturnHistory": "reports.purchaseReturnHistory",
  "/expense": "expense.voucher",
  "/reports/expense": "reports.expense",
  "/accounting/entries": "accounting.entries",
  "/accounting/customer-balance": "accounting.customerBalance",
  "/accounting/sub-ledgers": "accounting.subLedgers",
  "/accounting/trial-balance": "accounting.trialBalance",
  "/accounting/profit-loss": "accounting.profitLoss",
  "/accounting/balance-sheet": "accounting.balanceSheet",
  "/accounting/chart-of-accounts": "accounting.chartOfAccounts",
  "/accounting/manual-journal": "accounting.manualJournal",
  "/settings/company": "settings.company",
  "/settings/users": "settings.users",
  "/settings/roles": "settings.roles",
  "/settings/permissions": "settings.permissions",
};

export const getPermissionForPath = (pathname: string): ViewPermissionKey | null => {
  const match = Object.entries(PATH_PERMISSION_MAP)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => pathname === path || pathname.startsWith(`${path}/`));

  return match ? match[1] : null;
};

export type PermissionAction = "view" | "add" | "edit" | "delete";

export const permissionActionKey = (resourceKey: string, action: PermissionAction) =>
  `${resourceKey}.${action}`;

export const canViewPermission = (
  permissions: UserPermissions | null | undefined,
  key: ViewPermissionKey | string
) => canActionPermission(permissions, key, "view");

export const canActionPermission = (
  permissions: UserPermissions | null | undefined,
  key: ViewPermissionKey | string,
  action: PermissionAction
) => {
  if (!permissions) return false;
  if (permissions.isSuperAdmin || permissions.role === "super_admin") return true;

  const fullKey = permissionActionKey(key, action);
  if (permissions[fullKey] !== undefined) return Boolean(permissions[fullKey]);

  if (action === "view" && permissions[key] !== undefined) {
    return Boolean(permissions[key]);
  }

  return false;
};
