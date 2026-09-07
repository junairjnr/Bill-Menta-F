"use client";

import { useParams, useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import { useUom, useDeleteUom } from "@/app/hooks/masterHooks/uomHook/useUom";

const TABS = [{ key: "details", label: "Details" }];

export default function UomViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: uom, isLoading, isError } = useUom(id);
  const { mutateAsync: remove, isPending: deleting } = useDeleteUom();

  const handleDelete = async () => {
    await remove(id);
    router.push("/master/uom");
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

  if (isError || !uom) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load UOM.</p>
        </div>
      </BackPanel>
    );
  }

  return (
    <BackPanel
      tabs={TABS}
      editPath={`/master/uom/edit/${id}`}
      deleteItemName={uom.name}
      onDelete={handleDelete}
      deleting={deleting}
    >
      <div className="space-y-6">
        <ViewSection id="details" title="UOM Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Name" value={uom.name} />
            <ViewField label="Short Code" value={uom.shortCode} />
            <ViewField label="Type" value={uom.type} capitalize />
            <ViewField
              label="Status"
              value={uom.isActive ? "Active" : "Inactive"}
              badge
              badgeColor={uom.isActive ? "green" : "red"}
            />
          </div>
        </ViewSection>
      </div>
    </BackPanel>
  );
}
