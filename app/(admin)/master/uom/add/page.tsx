"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { uomFormFooterButtons } from "@/app/utilsComponents/form-footer";
import UOMForm from "../UOMForm";
import React from "react";

const UOMAddPage = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const onCancel = useCallback(() => router.back(), [router]);
  const buttons = useMemo(
    () => uomFormFooterButtons({ isPending, onCancel }),
    [isPending, onCancel]
  );

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        <UOMForm onPendingChange={setIsPending} />
      </div>
    </BackPanel>
  );
};

export default React.memo(UOMAddPage);
