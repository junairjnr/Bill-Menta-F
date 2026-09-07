"use client";

import { useParams } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { warehouseFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import { useWarehouse } from "@/app/hooks/warehouseHooks/useWarehouse";
import WarehouseForm from "../../WarehouseForm";
import React from "react";

const EditWarehouse = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useWarehouse(id ?? "");
  const { buttons, onPendingChange } = useFormPageFooter(warehouseFormFooterButtons, {
    isEdit: true,
    ready: !!data,
  });

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full justify-center items-center">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load warehouse.</p>
        ) : data ? (
          <WarehouseForm
            initialValues={{
              ...data,
              name: data.name ?? "",
              code: data.code ?? "",
              isDefault: data.isDefault ?? false,
              description: data.description ?? "",
            }}
            isEdit
            editId={id}
            onPendingChange={onPendingChange}
          />
        ) : null}
      </div>
    </BackPanel>
  );
};

export default React.memo(EditWarehouse);
