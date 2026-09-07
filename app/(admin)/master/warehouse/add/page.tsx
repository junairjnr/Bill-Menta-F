"use client";

import BackPanel from "@/app/utilsComponents/BackPanel";
import { warehouseFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import WarehouseForm from "../WarehouseForm";
import React from "react";

const Warehouse = () => {
  const { buttons, onPendingChange } = useFormPageFooter(warehouseFormFooterButtons);

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        <WarehouseForm onPendingChange={onPendingChange} />
      </div>
    </BackPanel>
  );
};

export default React.memo(Warehouse);
