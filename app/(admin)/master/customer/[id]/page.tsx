"use client";

import { useParams, useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import ViewSection from "@/app/utilsComponents/ViewSection";
import ViewField from "@/app/utilsComponents/ViewField";
import {
  useCustomer,
  useDeleteCustomer,
} from "@/app/hooks/masterHooks/customerHook/useCustomer";

const TABS = [
  { key: "details", label: "Details" },
  { key: "address", label: "Address" },
];

export default function CustomerViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: customer, isLoading, isError } = useCustomer(id);
  const { mutateAsync: remove, isPending: deleting } = useDeleteCustomer();

  const handleDelete = async () => {
    await remove(id);
    router.push("/master/customer");
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

  if (isError || !customer) {
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
      editPath={`/master/customer/edit/${id}`}
      deleteItemName={customer.name}
      onDelete={handleDelete}
      deleting={deleting}
    >
      <div className="space-y-6">
        <ViewSection id="details" title="Party Details">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField
              label="Party Type"
              value={
                customer.type === "sales" ? "Sales Customer" : "Purchase Party"
              }
              badge
              badgeColor={customer.type === "sales" ? "blue" : "yellow"}
            />
            <ViewField label="Name" value={customer.name} />
            <ViewField label="Phone" value={customer.phone} />
            <ViewField label="Email" value={customer.email} />
            <ViewField label="GSTIN" value={customer.gstin} />
            <ViewField
              label="Customer Type"
              value={customer.customerType}
              capitalize
            />
            {customer.type === "sales" && (
              <ViewField
                label="Credit Limit"
                value={`₹ ${customer.creditLimit?.toFixed(2) ?? "0.00"}`}
              />
            )}
            <ViewField
              label="Status"
              value={customer.isActive ? "Active" : "Inactive"}
              badge
              badgeColor={customer.isActive ? "green" : "red"}
            />
          </div>
        </ViewSection>

        <ViewSection id="address" title="Address">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ViewField label="Line 1" value={customer.address?.line1} />
            <ViewField label="Line 2" value={customer.address?.line2} />
            <ViewField label="Place" value={customer.address?.place} />
            <ViewField label="City" value={customer.address?.city} />
            <ViewField label="State" value={customer.address?.state} />
            <ViewField label="State Code" value={customer.address?.stateCode} />
            <ViewField label="Pincode" value={customer.address?.pincode} />
            <ViewField label="Country" value={customer.address?.country} />
          </div>
        </ViewSection>
      </div>
    </BackPanel>
  );
}
