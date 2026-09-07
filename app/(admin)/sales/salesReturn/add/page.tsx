"use client";

import { Suspense } from "react";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { salesReturnFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import SalesReturnForm from "../SalesReturnForm";

function FormFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );
}

function SalesReturnAddForm() {
  const { buttons, onPendingChange } = useFormPageFooter(salesReturnFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        <SalesReturnForm onPendingChange={onPendingChange} />
      </div>
    </BackPanel>
  );
}

export default function SalesReturnAddPage() {
  return (
    <Suspense fallback={<FormFallback />}>
      <SalesReturnAddForm />
    </Suspense>
  );
}
