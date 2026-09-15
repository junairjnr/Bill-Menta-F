"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { taxMasterFormFooterButtons } from "@/app/utilsComponents/form-footer";
import TaxMasterForm from "../TaxMasterForm";
import React from "react";

const TaxMasterAddPage = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const onCancel = useCallback(() => router.back(), [router]);
  const buttons = useMemo(
    () => taxMasterFormFooterButtons({ isPending, onCancel }),
    [isPending, onCancel]
  );

  return (
    <BackPanel buttons={buttons}>
      <div className="flex h-full">
        <TaxMasterForm onPendingChange={setIsPending} />
      </div>
    </BackPanel>
  );
};

export default React.memo(TaxMasterAddPage);
