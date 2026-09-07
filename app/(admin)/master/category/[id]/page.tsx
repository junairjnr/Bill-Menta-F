"use client";

import { useParams, useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import {
  useItemCategory,
  useDeleteItemCategory,
} from "@/app/hooks/masterHooks/itemCategoryHook/useItemCategory";

const TABS = [{ key: "details", label: "Details" }];

export default function CategoryViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: category, isLoading, isError } = useItemCategory(id);
  const { mutateAsync: remove, isPending: deleting } = useDeleteItemCategory();

  const handleDelete = async () => {
    await remove(id);
    router.push("/master/category");
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

  if (isError || !category) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load.</p>
        </div>
      </BackPanel>
    );
  }

  return (
    <BackPanel
      tabs={TABS}
      editPath={`/master/category/edit/${id}`}
      deleteItemName={category.name}
      onDelete={handleDelete}
      deleting={deleting}
    >
      <div className="space-y-6">
        <ViewSection id="details" title="Category Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Name" value={category.name} />
            <ViewField label="Description" value={category.description} />
            <ViewField
              label="Status"
              value={category.isActive ? "Active" : "Inactive"}
              badge
              badgeColor={category.isActive ? "green" : "red"}
            />
          </div>
        </ViewSection>
      </div>
    </BackPanel>
  );
}
