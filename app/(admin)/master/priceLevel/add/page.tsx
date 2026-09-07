"use client";

import BackPanel from "@/app/utilsComponents/BackPanel";
import { priceLevelFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import PriceLevelForm from "../PriceLevelForm";
import React from "react";

const AddPriceLevelPage = () => {
  const { buttons, onPendingChange } = useFormPageFooter(priceLevelFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        <PriceLevelForm onPendingChange={onPendingChange} />
      </div>
    </BackPanel>
  );
};

export default React.memo(AddPriceLevelPage);
