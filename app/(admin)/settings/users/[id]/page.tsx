"use client";

import { useParams, useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import { useUser, useDeactivateUser } from "@/app/hooks/userHook/useUser";
import { getRoleLabel } from "@/app/config/roles";
import { formatDate } from "@/app/utilsComponents/DateFormat";

const TABS = [{ key: "details", label: "Details" }];

export default function UserViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: user, isLoading, isError } = useUser(id ?? "");
  const { mutateAsync: deactivate, isPending: deactivating } = useDeactivateUser();

  const handleDelete = async () => {
    await deactivate(id);
    router.push("/settings/users");
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

  if (isError || !user) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load user.</p>
        </div>
      </BackPanel>
    );
  }

  const branchName =
    typeof user.branchId === "object" && user.branchId ? user.branchId.name : "—";

  return (
    <BackPanel
      tabs={TABS}
      editPath={user.role === "super_admin" ? undefined : `/settings/users/edit/${id}`}
      deleteItemName={user.name}
      onDelete={user.role === "super_admin" || !user.isActive ? undefined : handleDelete}
      deleting={deactivating}
    >
      <div className="space-y-6">
        <ViewSection id="details" title="User Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Name" value={user.name} />
            <ViewField label="Email" value={user.email} />
            <ViewField label="Role" value={getRoleLabel(user.role)} capitalize />
            <ViewField label="Branch" value={branchName} />
            <ViewField
              label="Status"
              value={user.isActive ? "Active" : "Inactive"}
              badge
              badgeColor={user.isActive ? "green" : "red"}
            />
            <ViewField
              label="Verified"
              value={user.isVerified ? "Yes" : "No"}
              badge
              badgeColor={user.isVerified ? "green" : "gray"}
            />
            <ViewField label="Created" value={formatDate(user.createdAt)} />
          </div>
        </ViewSection>
      </div>
    </BackPanel>
  );
}
