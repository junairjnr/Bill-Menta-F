"use client";

import { useParams } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { bankFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import { useBankAccount } from "@/app/hooks/masterHooks/bankHook/useBank";
import BankAccountForm from "../../BankForm";
import React from "react";

const EditBankPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useBankAccount(id ?? "");
  const { buttons, onPendingChange } = useFormPageFooter(bankFormFooterButtons, {
    isEdit: true,
    ready: !!data,
  });

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full justify-center items-center">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load bank account.</p>
        ) : data ? (
          <BankAccountForm
            initialValues={{
              accountName: data.accountName ?? "",
              bankName: data.bankName ?? "",
              accountNumber: data.accountNumber ?? "",
              ifscCode: data.ifscCode ?? "",
              branch: data.branch ?? "",
              accountType: data.accountType ?? "current",
              upiId: data.upiId ?? "",
              isDefault: data.isDefault ?? false,
            }}
            isEdit
            editId={id}
            onPendingChange={onPendingChange}
          />
        ) : null}
      </div>
    </BackPanel>
  );
};

export default React.memo(EditBankPage);
