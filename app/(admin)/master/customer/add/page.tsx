"use client";

import BackPanel from "@/app/utilsComponents/BackPanel";
import { customerFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import CustomerForm from "../CustomerForm";

export default function CustomerAddPage() {
  const { buttons, onPendingChange } = useFormPageFooter(customerFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        <CustomerForm onPendingChange={onPendingChange} />
      </div>
    </BackPanel>
  );
}
