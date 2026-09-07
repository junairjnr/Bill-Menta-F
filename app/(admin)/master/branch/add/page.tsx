"use client";

import BackPanel from "@/app/utilsComponents/BackPanel";
import { branchFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import BranchForm from "../BranchForm";
import React from "react";

const BranchAddPage = () => {
  const { buttons, onPendingChange } = useFormPageFooter(branchFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        <BranchForm onPendingChange={onPendingChange} />
      </div>
    </BackPanel>
  );
};

export default React.memo(BranchAddPage);
