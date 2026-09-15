"use client";

import { useParams, useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import {
  useDeleteTaxMaster,
  useTaxMaster,
} from "@/app/hooks/masterHooks/taxMasterHook/useTaxMaster";

const TABS = [{ key: "details", label: "Details" }];

export default function TaxMasterViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: taxMaster, isLoading, isError } = useTaxMaster(id);
  const { mutateAsync: remove, isPending: deleting } = useDeleteTaxMaster();

  const handleDelete = async () => {
    await remove(id);
    router.push("/master/taxMaster");
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

  if (isError || !taxMaster) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load tax master.</p>
        </div>
      </BackPanel>
    );
  }

  return (
    <BackPanel
      tabs={TABS}
      editPath={`/master/taxMaster/edit/${id}`}
      deleteItemName={taxMaster.name}
      onDelete={handleDelete}
      deleting={deleting}
    >
      <div className="space-y-6">
        <ViewSection id="details" title="Tax Master Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Name" value={taxMaster.name} />
            <ViewField label="GST %" value={`${taxMaster.taxPercent}%`} />
            <ViewField
              label="Status"
              value={taxMaster.isActive ? "Active" : "Inactive"}
              badge
              badgeColor={taxMaster.isActive ? "green" : "red"}
            />
          </div>
        </ViewSection>
      </div>
    </BackPanel>
  );
}
