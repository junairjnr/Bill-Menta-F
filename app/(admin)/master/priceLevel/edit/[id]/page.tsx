"use client";

import BackPanel from "@/app/utilsComponents/BackPanel";
import { useParams } from "next/navigation";
import { priceLevelFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import { usePriceLevel } from "@/app/hooks/masterHooks/priceLevelHook/usePriceLevel";
import PriceLevelForm from "../../PriceLevelForm";
import React from "react";

const EditPriceLevel = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = usePriceLevel(id ?? "");
  const { buttons, onPendingChange } = useFormPageFooter(priceLevelFormFooterButtons, {
    isEdit: true,
    ready: !!data,
  });

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full justify-center items-center">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load price level.</p>
        ) : data ? (
          <PriceLevelForm
            initialValues={{
              ...data,
              name: data.name ?? "",
              taxPercent: data.taxPercent ?? "",
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

export default React.memo(EditPriceLevel);
