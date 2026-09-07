"use client";

import { Suspense } from "react";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { purchaseReturnFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import PurchaseReturnForm from "../PurchaseReturnForm";

function FormFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );
}

function PurchaseReturnAddForm() {
  const { buttons, onPendingChange } = useFormPageFooter(purchaseReturnFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        <PurchaseReturnForm onPendingChange={onPendingChange} />
      </div>
    </BackPanel>
  );
}

export default function PurchaseReturnAddPage() {
  return (
    <Suspense fallback={<FormFallback />}>
      <PurchaseReturnAddForm />
    </Suspense>
  );
}
