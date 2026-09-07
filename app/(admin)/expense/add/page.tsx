"use client";

import { Suspense } from "react";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { expenseFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import ExpenseForm from "../ExpenseForm";

function FormFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );
}

function ExpenseAddForm() {
  const { buttons, onPendingChange } = useFormPageFooter(expenseFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full w-full">
        <ExpenseForm onPendingChange={onPendingChange} />
      </div>
    </BackPanel>
  );
}

export default function ExpenseAddPage() {
  return (
    <Suspense fallback={<FormFallback />}>
      <ExpenseAddForm />
    </Suspense>
  );
}
