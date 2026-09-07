"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import { useRole, useDeleteRole } from "@/app/hooks/settingsHook/useSettings";
import { usePermissions } from "@/app/hooks/usePermissions";
import { getRoleLabel } from "@/app/config/roles";

const TABS = [{ key: "details", label: "Details" }];

export default function RoleViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isSuperAdmin, canAction } = usePermissions();
  const { data: role, isLoading, isError } = useRole(id ?? "");
  const { mutateAsync: remove, isPending: deleting } = useDeleteRole();

  const canDelete = isSuperAdmin || canAction("settings.roles", "delete");
  const canEditPermissions =
    isSuperAdmin || canAction("settings.permissions", "view");

  const handleDelete = async () => {
    await remove(id);
    router.push("/settings/roles");
  };

  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError || !role) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load role.</p>
        </div>
      </BackPanel>
    );
  }

  return (
    <BackPanel
      tabs={TABS}
      editPath={`/settings/roles/edit/${id}`}
      deleteItemName={role.name}
      onDelete={canDelete ? handleDelete : undefined}
      deleting={deleting}
    >
      <div className="space-y-6">
        <ViewSection id="details" title="Role Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Name" value={role.name} />
            <ViewField label="Slug" value={role.slug} />
            <ViewField
              label="Based On"
              value={role.basedOn ? getRoleLabel(role.basedOn) : "—"}
              capitalize
            />
            <ViewField label="Description" value={role.description || "—"} />
          </div>

          {canEditPermissions && (
            <Link
              href={`/settings/permissions?role=${encodeURIComponent(role.slug)}`}
              className="mt-6 inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline"
            >
              <Shield size={14} />
              Edit permissions
            </Link>
          )}
        </ViewSection>
      </div>
    </BackPanel>
  );
}
