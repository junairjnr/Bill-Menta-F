"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { productFormFooterButtons } from "@/app/utilsComponents/form-footer";
import ProductForm from "../../ProductForm";
import { useItem } from "@/app/hooks/masterHooks/itemHook/useItem";
import { itemPurchaseRate, itemSalesRate } from "@/app/utils/itemRates";
import React from "react";

const EditProduct = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [isPending, setIsPending] = useState(false);
  const { data, isLoading, isError } = useItem(id ?? "");
  const onCancel = useCallback(() => router.back(), [router]);
  const buttons = useMemo(
    () =>
      data
        ? productFormFooterButtons({ isEdit: true, isPending, onCancel })
        : [],
    [data, isPending, onCancel]
  );

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full justify-center items-center">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load product.</p>
        ) : data ? (
          <ProductForm
            initialValues={{
              ...data,
              code: data.code ?? "",
              hsnCode: data.hsnCode ?? "",
              salesRate: itemSalesRate(data) || "",
              purchaseRate: itemPurchaseRate(data) || "",
              price: itemSalesRate(data) || "",
              taxPercent: data?.taxPercent,
              taxMasterId:
                typeof data?.taxMasterId === "object"
                  ? data.taxMasterId._id
                  : data?.taxMasterId ?? "",
              categoryId: data?.categoryId._id,
              uomId: data?.uomId?._id,
              description: data.description ?? "",
              isActive: data?.isActive,
            }}
            isEdit
            editId={id}
            onPendingChange={setIsPending}
          />
        ) : null}
      </div>
    </BackPanel>
  );
};

export default React.memo(EditProduct);
