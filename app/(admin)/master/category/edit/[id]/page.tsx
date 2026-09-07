"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { categoryFormFooterButtons } from "@/app/utilsComponents/form-footer";
import CategoryForm from "../../CategoryForm";
import { useItemCategory } from "@/app/hooks/masterHooks/itemCategoryHook/useItemCategory";
import React from "react";

const EditCategory = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [isPending, setIsPending] = useState(false);
  const { data, isLoading, isError } = useItemCategory(id ?? "");
  const onCancel = useCallback(() => router.back(), [router]);
  const buttons = useMemo(
    () =>
      data
        ? categoryFormFooterButtons({ isEdit: true, isPending, onCancel })
        : [],
    [data, isPending, onCancel]
  );

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full justify-center items-center">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load category.</p>
        ) : data ? (
          <CategoryForm
            initialValues={{
              ...data,
              description: data.description ?? "",
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

export default React.memo(EditCategory);
