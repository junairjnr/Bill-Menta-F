"use client";

import BackPanel from "@/app/utilsComponents/BackPanel";
import { useParams } from "next/navigation";
import { taxMasterFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import { useTaxMaster } from "@/app/hooks/masterHooks/taxMasterHook/useTaxMaster";
import TaxMasterForm from "../../TaxMasterForm";
import React from "react";

const EditTaxMasterPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useTaxMaster(id ?? "");
  const { buttons, onPendingChange } = useFormPageFooter(taxMasterFormFooterButtons, {
    isEdit: true,
    ready: !!data,
  });

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full justify-center items-center">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load tax master.</p>
        ) : data ? (
          <TaxMasterForm
            initialValues={{
              name: data.name ?? "",
              taxPercent: data.taxPercent ?? "",
              isActive: data.isActive,
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

export default React.memo(EditTaxMasterPage);
