"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { FooterButton } from "@/app/utilsComponents/BackPanel";

type FormFooterOptions = {
  isEdit?: boolean;
  isPending?: boolean;
  onCancel: () => void;
};

type UseFormPageFooterOptions = {
  isEdit?: boolean;
  ready?: boolean;
};

export function useFormPageFooter(
  buildButtons: (options: FormFooterOptions) => FooterButton[],
  { isEdit = false, ready = true }: UseFormPageFooterOptions = {}
) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const onCancel = useCallback(() => router.back(), [router]);
  const buttons = useMemo(
    () => (ready ? buildButtons({ isEdit, isPending, onCancel }) : []),
    [buildButtons, isEdit, isPending, onCancel, ready]
  );

  return { buttons, onPendingChange: setIsPending };
}
