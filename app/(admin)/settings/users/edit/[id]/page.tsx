"use client";

import React from "react";
import { useParams } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { userFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import { useUser } from "@/app/hooks/userHook/useUser";
import UserForm from "../../UserForm";

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, isError } = useUser(id ?? "");
  const { buttons, onPendingChange } = useFormPageFooter(userFormFooterButtons, {
    isEdit: true,
    ready: !!user,
  });

  return (
    <BackPanel buttons={buttons}>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      ) : isError || !user ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load user.</p>
        </div>
      ) : user.role === "super_admin" ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-500">Super admin account cannot be edited.</p>
        </div>
      ) : (
        <UserForm
          isEdit
          editId={id}
          onPendingChange={onPendingChange}
          initialValues={{
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            branchId:
              typeof user.branchId === "string"
                ? user.branchId
                : user.branchId?._id || "",
            isActive: user.isActive,
          }}
        />
      )}
    </BackPanel>
  );
}
