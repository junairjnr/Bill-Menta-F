"use client";

import { useParams, useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import { useItem, useDeleteItem } from "@/app/hooks/masterHooks/itemHook/useItem";
import { itemPurchaseRate, itemSalesRate } from "@/app/utils/itemRates";

const TABS = [
  { key: "details", label: "Details" },
  // { key: "pricing", label: "Pricing & Tax" },
];

export default function ItemViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: item, isLoading, isError } = useItem(id);
  const { mutateAsync: remove, isPending: deleting } = useDeleteItem();

  const handleDelete = async () => {
    await remove(id);
    router.push("/master/product");
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

  if (isError || !item) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">Failed to load.</p>
        </div>
      </BackPanel>
    );
  }

  const categoryName =
    typeof item.categoryId === "object" ? item?.categoryId?.name : "—";
  const uomName =
    typeof item.uomId === "object"
      ? `${item?.uomId?.name} (${item?.uomId?.shortCode})`
      : "—";

  return (
    <BackPanel
      tabs={TABS}
      editPath={`/master/product/edit/${id}`}
      deleteItemName={item.name}
      onDelete={handleDelete}
      deleting={deleting}
    >
      <div className="space-y-6">
        <ViewSection id="details" title="Item Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Name" value={item.name} />
            <ViewField label="Code / SKU" value={item.code} />
            <ViewField label="HSN Code" value={item.hsnCode} />
            <ViewField label="Category" value={categoryName} />
            <ViewField label="Unit (UOM)" value={uomName} />
            <ViewField
              label="Sales Rate"
              value={`₹ ${itemSalesRate(item).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            />
            <ViewField
              label="Purchase Rate"
              value={`₹ ${itemPurchaseRate(item).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            />
            <ViewField label="GST %" value={`${item.taxPercent}%`} />
            <ViewField label="Description" value={item.description} />
            <ViewField
              label="Status"
              value={item.isActive ? "Active" : "Inactive"}
              badge
              badgeColor={item.isActive ? "green" : "red"}
            />
          </div>
        </ViewSection>

        {/* <ViewSection id="pricing" title="Pricing & Tax">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Price" value={`₹ ${item.price.toFixed(2)}`} />
            <ViewField label="GST %" value={`${item.taxPercent}%`} />
            <ViewField
              label="SGST"
              value={`${(item.taxPercent / 2).toFixed(2)}%`}
            />
            <ViewField
              label="CGST"
              value={`${(item.taxPercent / 2).toFixed(2)}%`}
            />
          </div>
        </ViewSection> */}
      </div>
    </BackPanel>
  );
}
