"use client";

import BackPanel from "@/app/utilsComponents/BackPanel";
import { bankFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import BankAccountForm from "../BankForm";
import React from "react";

const BankAddPage = () => {
  const { buttons, onPendingChange } = useFormPageFooter(bankFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        <BankAccountForm onPendingChange={onPendingChange} />
      </div>
    </BackPanel>
  );
};

export default React.memo(BankAddPage);
