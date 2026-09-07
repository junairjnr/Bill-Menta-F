"use client";

import BackPanel from "@/app/utilsComponents/BackPanel";
import { useParams } from "next/navigation";
import { branchFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import { useBranch } from "@/app/hooks/branchHook/useBranch";
import BranchForm from "../../BranchForm";
import React from "react";

const EditBranchPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useBranch(id ?? "");
  const { buttons, onPendingChange } = useFormPageFooter(branchFormFooterButtons, {
    isEdit: true,
    ready: !!data,
  });

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load branch.</p>
        ) : data ? (
          <BranchForm
            initialValues={{
              name: data.name ?? "",
              code: data.code ?? "",
              address: {
                line1: data.address?.line1 ?? "",
                place: data.address?.place ?? "",
                city: data.address?.city ?? "",
                state: data.address?.state ?? "",
                stateCode: data.address?.stateCode ?? "",
                pincode: data.address?.pincode ?? "",
              },
              phone: data.phone ?? "",
              email: data.email ?? "",
              gstin: data.gstin ?? "",
              isHeadOffice: data.isHeadOffice ?? false,
              isActive: data.isActive ?? true,
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

export default React.memo(EditBranchPage);
