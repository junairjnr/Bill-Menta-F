"use client";

import { useEffect, useState } from "react";
import QuickAddDialog from "./QuickAddDialog";
import CustomerForm from "@/app/(admin)/master/customer/CustomerForm";
import WarehouseForm from "@/app/(admin)/master/warehouse/WarehouseForm";
import ProductForm from "@/app/(admin)/master/product/ProductForm";
import {
  customerFormFooterButtons,
  warehouseFormFooterButtons,
  productFormFooterButtons,
} from "./form-footer";

export type QuickAddModal = "party" | "warehouse" | "product" | null;

interface InvoiceQuickAddModalsProps {
  active: QuickAddModal;
  mode: "sales" | "purchase";
  salesType?: "retail" | "wholesale";
  onClose: () => void;
  onPartySuccess: (data: unknown) => void;
  onWarehouseSuccess: (data: unknown) => void;
  onProductSuccess: (data: unknown) => void;
}

export function getEntityId(data: unknown): string {
  return (data as { _id?: string })?._id ?? "";
}

export default function InvoiceQuickAddModals({
  active,
  mode,
  salesType = "retail",
  onClose,
  onPartySuccess,
  onWarehouseSuccess,
  onProductSuccess,
}: InvoiceQuickAddModalsProps) {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!active) setPending(false);
  }, [active]);

  return (
    <>
      <QuickAddDialog
        open={active === "party"}
        onOpenChange={(open) => !open && onClose()}
        title={mode === "sales" ? "Add Customer" : "Add Vendor"}
        footerButtons={customerFormFooterButtons({
          isPending: pending,
          onCancel: onClose,
        })}
      >
        <CustomerForm
          key={`party-${mode}-${salesType}`}
          modalMode
          onPendingChange={setPending}
          initialValues={{
            type: mode === "sales" ? "sales" : "purchase",
            name: "",
            email: "",
            phone: "",
            gstin: "",
            customerType: salesType,
            creditLimit: "",
            line1: "",
            line2: "",
            place: "",
            city: "",
            state: "",
            stateCode: "",
            pincode: "",
          }}
          onSuccess={(data) => {
            onPartySuccess(data);
            onClose();
          }}
        />
      </QuickAddDialog>

      <QuickAddDialog
        open={active === "warehouse"}
        onOpenChange={(open) => !open && onClose()}
        title="Add Warehouse"
        footerButtons={warehouseFormFooterButtons({
          isPending: pending,
          onCancel: onClose,
        })}
      >
        <WarehouseForm
          key="warehouse"
          modalMode
          onPendingChange={setPending}
          onSuccess={(data) => {
            onWarehouseSuccess(data);
            onClose();
          }}
        />
      </QuickAddDialog>

      <QuickAddDialog
        open={active === "product"}
        onOpenChange={(open) => !open && onClose()}
        title="Add Product"
        footerButtons={productFormFooterButtons({
          isPending: pending,
          onCancel: onClose,
        })}
      >
        <ProductForm
          key="product"
          modalMode
          onPendingChange={setPending}
          onSuccess={(data) => {
            onProductSuccess(data);
            onClose();
          }}
        />
      </QuickAddDialog>
    </>
  );
}
