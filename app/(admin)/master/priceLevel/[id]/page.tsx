"use client";

import { useParams, useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import {
  useDeletePriceLevel,
  usePriceLevel,
} from "@/app/hooks/masterHooks/priceLevelHook/usePriceLevel";

const TABS = [
  { key: "details", label: "Details" },
  { key: "audit", label: "Audit" },
];

export default function PriceLevelViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: priceLevel, isLoading, isError } = usePriceLevel(id);
  const { mutateAsync: remove, isPending: deleting } = useDeletePriceLevel();

  const handleDelete = async () => {
    await remove(id);
    router.push("/master/priceLevel");
  };

  if (isLoading) {
    return (
      <BackPanel>
        <p className="text-sm text-gray-400">Loading...</p>
      </BackPanel>
    );
  }

  if (isError || !priceLevel) {
    return (
      <BackPanel>
        <p className="text-sm text-red-400">Failed to load Price Level.</p>
      </BackPanel>
    );
  }

  return (
    <BackPanel
      tabs={TABS}
      editPath={`/master/priceLevel/edit/${id}`}
      deleteItemName={priceLevel.name}
      onDelete={handleDelete}
      deleting={deleting}
    >
      <div className="space-y-6">
        <ViewSection id="details" title="Price Level Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Name" value={priceLevel.name} />
            <ViewField label="Tax Percent" value={`${priceLevel.taxPercent}%`} />
            <ViewField
              label="Status"
              value={priceLevel.isActive ? "Active" : "Inactive"}
              badge
              badgeColor={priceLevel.isActive ? "green" : "red"}
            />
          </div>
        </ViewSection>

        <ViewSection id="audit" title="Audit Information">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField
              label="Created"
              value={new Date(priceLevel.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            />
            <ViewField
              label="Last Updated"
              value={new Date(priceLevel.updatedAt).toLocaleDateString("en-IN", {
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
