"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { uomFormFooterButtons } from "@/app/utilsComponents/form-footer";
import { useUom } from "@/app/hooks/masterHooks/uomHook/useUom";
import UOMForm from "../../UOMForm";
import React from "react";

const EditUOM = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [isPending, setIsPending] = useState(false);
  const { data, isLoading, isError } = useUom(id ?? "");
  const onCancel = useCallback(() => router.back(), [router]);
  const buttons = useMemo(
    () =>
      data
        ? uomFormFooterButtons({ isEdit: true, isPending, onCancel })
        : [],
    [data, isPending, onCancel]
  );

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full justify-center items-center">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load UOM.</p>
        ) : data ? (
          <UOMForm
            initialValues={{
              ...data,
              shortCode: data.shortCode ?? "",
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

export default React.memo(EditUOM);
