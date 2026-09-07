"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { productFormFooterButtons } from "@/app/utilsComponents/form-footer";
import ProductForm from "../ProductForm";
import React from "react";

const ProductAddPage = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const onCancel = useCallback(() => router.back(), [router]);
  const buttons = useMemo(
    () => productFormFooterButtons({ isPending, onCancel }),
    [isPending, onCancel]
  );

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        <ProductForm onPendingChange={setIsPending} />
      </div>
    </BackPanel>
  );
};

export default React.memo(ProductAddPage);
