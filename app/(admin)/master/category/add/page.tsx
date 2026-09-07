"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { categoryFormFooterButtons } from "@/app/utilsComponents/form-footer";
import CategoryForm from "../CategoryForm";
import React from "react";

const CategoryAddPage = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const onCancel = useCallback(() => router.back(), [router]);
  const buttons = useMemo(
    () => categoryFormFooterButtons({ isPending, onCancel }),
    [isPending, onCancel]
  );

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        <CategoryForm onPendingChange={setIsPending} />
      </div>
    </BackPanel>
  );
};

export default React.memo(CategoryAddPage);
