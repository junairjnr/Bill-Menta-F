"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { expenseFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import ExpenseForm from "../../ExpenseForm";


function FormFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );
}

function ExpenseEditForm() {
  const { id } = useParams<{ id: string }>();
  const { buttons, onPendingChange } = useFormPageFooter(expenseFormFooterButtons, {
    isEdit: true,
    ready: !!id,
  });

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full w-full">
        <ExpenseForm editId={id} isEdit onPendingChange={onPendingChange} />
      </div>
    </BackPanel>
  );
}

export default function ExpenseEditPage() {
  return (
    <Suspense fallback={<FormFallback />}>
      <ExpenseEditForm />
    </Suspense>
  );
}
