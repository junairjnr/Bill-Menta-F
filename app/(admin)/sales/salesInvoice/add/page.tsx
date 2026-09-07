"use client";

import BackPanel from "@/app/utilsComponents/BackPanel";
import { salesInvoiceFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import SalesInvoiceForm from "../SalesInvoiceForm";
import React from "react";

const SalesInvoiceAdd = () => {
  const { buttons, onPendingChange } = useFormPageFooter(salesInvoiceFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        <SalesInvoiceForm onPendingChange={onPendingChange} />
      </div>
    </BackPanel>
  );
};

export default React.memo(SalesInvoiceAdd);
