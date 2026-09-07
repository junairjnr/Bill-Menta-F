"use client";

import { Suspense } from "react";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { vendorPaymentFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import ReceiptPaymentForm from "@/app/(admin)/reciept/payments/PaymentForm";

function FormFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );
}

function VendorPaymentAddForm() {
  const { buttons, onPendingChange } = useFormPageFooter(vendorPaymentFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full w-full">
        <ReceiptPaymentForm voucherType="payment" onPendingChange={onPendingChange} />
      </div>
    </BackPanel>
  );
}

export default function VendorPaymentAddPage() {
  return (
    <Suspense fallback={<FormFallback />}>
      <VendorPaymentAddForm />
    </Suspense>
  );
}
