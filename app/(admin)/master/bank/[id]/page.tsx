"use client";

import { useParams, useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import {
  useBankAccount,
  useDeleteBankAccount,
} from "@/app/hooks/masterHooks/bankHook/useBank";
import { formatDate } from "@/app/utilsComponents/DateFormat";

const TABS = [
  { key: "details", label: "Details" },
  { key: "audit", label: "Audit" },
];

const TYPE_LABELS: Record<string, string> = {
  current: "Current",
  savings: "Savings",
  overdraft: "Overdraft",
};

export default function BankViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: account, isLoading, isError } = useBankAccount(id ?? "");
  const { mutateAsync: remove, isPending: deleting } = useDeleteBankAccount();

  const handleDelete = async () => {
    await remove(id);
    router.push("/master/bank");
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

  if (isError || !account) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load bank account.</p>
        </div>
      </BackPanel>
    );
  }

  return (
    <BackPanel
      tabs={TABS}
      editPath={`/master/bank/edit/${id}`}
      deleteItemName={account.accountName}
      onDelete={handleDelete}
      deleting={deleting}
    >
      <div className="space-y-6">
        <ViewSection id="details" title="Bank Account Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ViewField label="Account Name" value={account.accountName} />
            <ViewField label="Bank Name" value={account.bankName} />
            <ViewField label="Account No" value={account.accountNumber} />
            <ViewField label="IFSC Code" value={account.ifscCode} />
            <ViewField label="Branch" value={account.branch} />
            <ViewField
              label="Account Type"
              value={TYPE_LABELS[account.accountType] ?? account.accountType}
              badge
              badgeColor="blue"
            />
            <ViewField label="UPI ID" value={account.upiId} />
            <ViewField
              label="Default Account"
              value={account.isDefault ? "Yes" : "No"}
              badge
              badgeColor={account.isDefault ? "green" : "gray"}
            />
            <ViewField
              label="Status"
              value={account.isActive ? "Active" : "Inactive"}
              badge
              badgeColor={account.isActive ? "green" : "red"}
            />
          </div>
        </ViewSection>

        <ViewSection id="audit" title="Audit Information">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Created" value={formatDate(account.createdAt)} />
          </div>
        </ViewSection>
      </div>
    </BackPanel>
  );
}
