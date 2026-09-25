"use client";

import { Suspense } from "react";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { quotationFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import QuotationForm from "../QuotationForm";

function FormFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );
}

function QuotationAddForm() {
  const { buttons, onPendingChange } = useFormPageFooter(
    quotationFormFooterButtons
  );

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        <QuotationForm onPendingChange={onPendingChange} />
      </div>
    </BackPanel>
  );
}

export default function QuotationAddPage() {
  return (
    <Suspense fallback={<FormFallback />}>
      <QuotationAddForm />
    </Suspense>
  );
}
