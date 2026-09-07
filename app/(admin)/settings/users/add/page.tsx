"use client";

import React from "react";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { userFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import UserForm from "../UserForm";

export default function UserAddPage() {
  const { buttons, onPendingChange } = useFormPageFooter(userFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <UserForm onPendingChange={onPendingChange} />
    </BackPanel>
  );
}
