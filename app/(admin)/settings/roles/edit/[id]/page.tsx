"use client";

import React from "react";
import { useParams } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { roleFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useFormPageFooter } from "@/app/hooks/useFormPageFooter";
import { useRole } from "@/app/hooks/settingsHook/useSettings";
import RoleForm from "../../RoleForm";

export default function RoleEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: role, isLoading, isError } = useRole(id ?? "");
  const { buttons, onPendingChange } = useFormPageFooter(roleFormFooterButtons, {
    isEdit: true,
    ready: !!role,
  });

  return (
    <BackPanel buttons={buttons}>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      ) : isError || !role ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load role.</p>
        </div>
      ) : (
        <RoleForm
          isEdit
          editId={id}
          onPendingChange={onPendingChange}
          initialValues={{
            name: role.name,
            description: role.description,
            basedOn: role.basedOn || "viewer",
          }}
        />
      )}
    </BackPanel>
  );
}
