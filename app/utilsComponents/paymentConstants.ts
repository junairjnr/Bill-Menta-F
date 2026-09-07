import type { PaymentStatus } from "@/app/types";

export const PAYMENT_MODE_LABELS: Record<string, string> = {
  cash: "Cash",
  cheque: "Cheque",
  bank_transfer: "Bank Transfer",
  upi: "UPI",
  other: "Other",
};

export const PAYMENT_MODES = [
  { label: "Cash", value: "cash" },
  { label: "Cheque", value: "cheque" },
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "Bank", value: "bank" },
  { label: "UPI", value: "upi" },
  { label: "Card", value: "card" },
  { label: "Other", value: "other" },
];

export const BANK_PAYMENT_MODES = ["cheque", "bank_transfer", "bank", "upi"];

export const needsBankAccount = (mode: string) =>
  BANK_PAYMENT_MODES.includes(mode);

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  unpaid: "Unpaid",
  partial: "Partially Paid",
  paid: "Paid",
};

export const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  pending: "bg-red-100 text-red-700",
  unpaid: "bg-red-100 text-red-700",
  partial: "bg-orange-100 text-orange-700",
  paid: "bg-green-100 text-green-700",
};

export function resolvePaymentStatus(
  grandTotal: number,
  paidAmount = 0,
  paymentStatus?: PaymentStatus
): PaymentStatus {
  if (paymentStatus === "pending" || paymentStatus === "unpaid") return paymentStatus;
  if (paymentStatus) return paymentStatus;
  if (paidAmount <= 0) return "pending";
  if (paidAmount >= grandTotal) return "paid";
  return "partial";
}

export function resolveBalance(
  grandTotal: number,
  paidAmount = 0,
  _balanceAmount?: number
): number {
  return Math.max(0, Number((grandTotal - paidAmount).toFixed(2)));
}

type NamedSnapshot = { name?: string };
type PopulatedParty = NamedSnapshot | string | null | undefined;

export function resolveCustomerName(invoice: {
  customerId?: PopulatedParty;
  customerSnapshot?: NamedSnapshot;
}): string {
  if (invoice.customerSnapshot?.name) return invoice.customerSnapshot.name;
  const customer = invoice.customerId;
  if (customer && typeof customer === "object" && customer.name) return customer.name;
  return "—";
}

export function resolvePartyName(voucher: {
  partyId?: PopulatedParty;
  partySnapshot?: NamedSnapshot;
  customerSnapshot?: NamedSnapshot;
}): string {
  if (voucher.partySnapshot?.name) return voucher.partySnapshot.name;
  const party = voucher.partyId;
  if (party && typeof party === "object" && party.name) return party.name;
  if (voucher.customerSnapshot?.name) return voucher.customerSnapshot.name;
  return "—";
}
