export const EXPENSE_CATEGORIES = [
  { value: "rent", label: "Rent" },
  { value: "salary", label: "Salary" },
  { value: "utilities", label: "Utilities" },
  { value: "transport", label: "Transport" },
  { value: "marketing", label: "Marketing" },
  { value: "office", label: "Office Supplies" },
  { value: "maintenance", label: "Maintenance" },
  { value: "other", label: "Other" },
] as const;

export const expenseCategoryLabel = (value: string) =>
  EXPENSE_CATEGORIES.find((c) => c.value === value)?.label ??
  value.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

export const PAYMENT_MODES = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "upi", label: "UPI" },
  { value: "cheque", label: "Cheque" },
  { value: "card", label: "Card" },
  { value: "other", label: "Other" },
] as const;
