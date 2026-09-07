"use client";

import BackPanel from "@/app/utilsComponents/BackPanel";
import { financialYearFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import FinancialYearForm from "../FinancialYearForm";
import React from "react";

const FinancialYearAddPage = () => {
  const { buttons, onPendingChange } = useFormPageFooter(financialYearFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <FinancialYearForm onPendingChange={onPendingChange} />
    </BackPanel>
  );
};

export default React.memo(FinancialYearAddPage);
