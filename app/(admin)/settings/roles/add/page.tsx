"use client";

import React from "react";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { roleFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import RoleForm from "../RoleForm";

export default function RoleAddPage() {
  const { buttons, onPendingChange } = useFormPageFooter(roleFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <RoleForm onPendingChange={onPendingChange} />
    </BackPanel>
  );
}
