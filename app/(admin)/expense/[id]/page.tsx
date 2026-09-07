"use client";

import { useParams, useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import ViewPageHeader from "@/app/utilsComponents/ViewPageHeader";
import {
  useDeleteExpense,
  useExpense,
} from "@/app/hooks/expenseHook/useExpense";
import { formatDate } from "@/app/utilsComponents/DateFormat";
import { expenseCategoryLabel } from "@/app/utilsComponents/expenseConstants";
import { PAYMENT_MODE_LABELS } from "@/app/utilsComponents/paymentConstants";

const TABS = [{ key: "details", label: "Details" }];

const MODE_BADGE: Record<string, "green" | "blue" | "gray" | "yellow" | "red"> = {
  cash: "green",
  cheque: "blue",
  bank_transfer: "gray",
  bank: "gray",
  upi: "yellow",
  card: "blue",
  other: "gray",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n || 0);

export default function ExpenseViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: expense, isLoading, isError } = useExpense(id);
  const { mutateAsync: remove, isPending: deleting } = useDeleteExpense();

  const handleDelete = async () => {
    await remove(id);
    router.push("/expense");
  };

  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError || !expense) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load expense.</p>
        </div>
      </BackPanel>
    );
  }

  const statusLabel =
    expense.status === "completed"
      ? "Completed"
      : expense.status === "cancelled"
        ? "Cancelled"
        : expense.status;

  return (
    <BackPanel
      tabs={TABS}
      editPath={`/expense/edit/${id}`}
      deleteItemName={expense.expenseNo}
      onDelete={handleDelete}
      deleting={deleting}
    >
      <div className="space-y-6">
        <ViewPageHeader
          title={expense.expenseNo}
          subtitle={formatDate(expense.date)}
        />

        <ViewSection id="details" title="Expense Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Expense No" value={expense.expenseNo} />
            <ViewField label="Date" value={formatDate(expense.date)} />
            <ViewField label="Category" value={expenseCategoryLabel(expense.category)} />
            <ViewField label="Title" value={expense.title} />
            <ViewField label="Amount" value={fmt(expense.amount)} />
            <ViewField
              label="Payment Mode"
              value={PAYMENT_MODE_LABELS[expense.paymentMode] ?? expense.paymentMode.replace(/_/g, " ")}
              badge
              badgeColor={MODE_BADGE[expense.paymentMode] ?? "gray"}
            />
            <ViewField
              label="Status"
              value={statusLabel}
              badge
              badgeColor={
                expense.status === "completed"
                  ? "green"
                  : expense.status === "cancelled"
                    ? "red"
                    : "gray"
              }
            />
            {expense.referenceNo && (
              <ViewField label="Reference No" value={expense.referenceNo} />
            )}
            {expense.notes && (
              <div className="md:col-span-2">
                <ViewField label="Notes" value={expense.notes} />
              </div>
            )}
          </div>
        </ViewSection>
      </div>
    </BackPanel>
  );
}
