"use client";

import BackPanel from "@/app/utilsComponents/BackPanel";
import { useParams } from "next/navigation";
import { customerFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import CustomerForm from "../../CustomerForm";
import { useCustomer } from "@/app/hooks/masterHooks/customerHook/useCustomer";
import React from "react";

const EditCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useCustomer(id ?? "");
  const { buttons, onPendingChange } = useFormPageFooter(customerFormFooterButtons, {
    isEdit: true,
    ready: !!data,
  });

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full justify-center items-center">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load customer.</p>
        ) : data ? (
          <CustomerForm
            initialValues={{
              ...data,
              customerType: data.customerType ?? "retail",
              creditLimit: data.creditLimit ?? "",
              email: data.email ?? "",
              phone: data.phone ?? "",
              gstin: data.gstin ?? "",
              line1: data.address?.line1 ?? "",
              line2: data.address?.line2 ?? "",
              place: data.address?.place ?? "",
              city: data.address?.city ?? "",
              state: data.address?.state ?? "",
              stateCode: data.address?.stateCode ?? "",
              pincode: data.address?.pincode ?? "",
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

export default React.memo(EditCustomer);
