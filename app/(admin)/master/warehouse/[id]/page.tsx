"use client";

import { useParams, useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import {
  useDeleteWarehouse,
  useWarehouse,
} from "@/app/hooks/warehouseHooks/useWarehouse";

const TABS = [
  { key: "details", label: "Details" },
  { key: "audit", label: "Audit" },
];

export default function WarehouseViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: warehouse, isLoading, isError } = useWarehouse(id ?? "");
  const { mutateAsync: remove, isPending: deleting } = useDeleteWarehouse();

  const handleDelete = async () => {
    await remove(id);
    router.push("/master/warehouse");
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

  if (isError || !warehouse) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load warehouse.</p>
        </div>
      </BackPanel>
    );
  }

  const branchName =
    typeof warehouse.branchId === "object" ? warehouse.branchId.name : "—";

  return (
    <BackPanel
      tabs={TABS}
      editPath={`/master/warehouse/edit/${id}`}
      deleteItemName={warehouse.name}
      onDelete={handleDelete}
      deleting={deleting}
    >
      <div className="space-y-6">
        <ViewSection id="details" title="Warehouse Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Name" value={warehouse.name} />
            <ViewField label="Code" value={warehouse.code} />
            <ViewField label="Branch" value={branchName} />
            <ViewField label="Description" value={warehouse.description} />
            <ViewField
              label="Default Warehouse"
              value={warehouse.isDefault ? "Yes" : "No"}
              badge
              badgeColor={warehouse.isDefault ? "green" : "gray"}
            />
            <ViewField
              label="Status"
              value={warehouse.isActive ? "Active" : "Inactive"}
              badge
              badgeColor={warehouse.isActive ? "green" : "red"}
            />
          </div>
        </ViewSection>

        <ViewSection id="audit" title="Audit Information">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField
              label="Created"
              value={new Date(warehouse.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            />
          </div>
        </ViewSection>
      </div>
    </BackPanel>
  );
}
