"use client";

import BackPanel from "@/app/utilsComponents/BackPanel";
import { purchaseInvoiceFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import PurchaseInvoiceForm from "../PurchaseINVForm";
import React from "react";

const PurchaseInvoiceAdd = () => {
  const { buttons, onPendingChange } = useFormPageFooter(purchaseInvoiceFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        <PurchaseInvoiceForm onPendingChange={onPendingChange} />
      </div>
    </BackPanel>
  );
};

export default React.memo(PurchaseInvoiceAdd);
