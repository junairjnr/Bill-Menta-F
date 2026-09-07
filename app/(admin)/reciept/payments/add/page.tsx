"use client";

import { Suspense } from "react";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { receiptVoucherFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import ReceiptPaymentForm from "../PaymentForm";

function FormFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );
}

function ReceiptAddForm() {
  const { buttons, onPendingChange } = useFormPageFooter(receiptVoucherFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full w-full">
        <ReceiptPaymentForm voucherType="receipt" onPendingChange={onPendingChange} />
      </div>
    </BackPanel>
  );
}

export default function ReceiptAddPage() {
  return (
    <Suspense fallback={<FormFallback />}>
      <ReceiptAddForm />
    </Suspense>
  );
}
