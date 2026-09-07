export const SYSTEM_ROLE_META: Record<
  string,
  { label: string; description: string }
> = {
  admin: {
    label: "Admin",
    description: "Primary admin with full business access.",
  },
  secondary_admin: {
    label: "Secondary Admin",
    description: "Broad business access; can help manage operations and users.",
  },
  salesman: {
    label: "Salesman",
    description: "Customer and sales-related work.",
  },
  biller: {
    label: "Biller",
    description: "Create and manage billing and invoices.",
  },
  accountant: {
    label: "Accountant",
    description: "Accounts, payments, and financial reporting work.",
  },
  stock_keeper: {
    label: "Stock Keeper",
    description: "Inventory, stock, and item-related work.",
  },
  viewer: {
    label: "Viewer",
    description: "View permitted business information only.",
  },
  manager: {
    label: "Manager (Legacy)",
    description: "Legacy role — prefer Secondary Admin or department roles.",
  },
  staff: {
    label: "Staff (Legacy)",
    description: "Legacy role — prefer Viewer or department roles.",
  },
};

export const ASSIGNABLE_SYSTEM_ROLES = [
  "admin",
  "secondary_admin",
  "salesman",
  "biller",
  "accountant",
  "stock_keeper",
  "viewer",
  "manager",
  "staff",
] as const;

export type SystemUserRole =
  | "super_admin"
  | (typeof ASSIGNABLE_SYSTEM_ROLES)[number];

export const getRoleLabel = (role: string, customName?: string) => {
  if (customName) return customName;
  return SYSTEM_ROLE_META[role]?.label || role.replace(/_/g, " ");
};

export const PRIVILEGED_ROLES = ["admin", "secondary_admin"];
