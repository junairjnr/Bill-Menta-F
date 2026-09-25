"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  focusNextEnterNavField,
  getTodayISO,
  isSelectMenuOpen,
} from "@/app/utilsComponents/invoiceFormUtils";
import { usePlatformKeyboardLabels } from "@/app/hooks/usePlatformKeyboardLabels";

type UseInvoiceFormShortcutsOptions = {
  onEnterAtLastField?: () => void;
};

export function useInvoiceFormShortcuts({
  onEnterAtLastField,
}: UseInvoiceFormShortcutsOptions = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [allowPastDates, setAllowPastDates] = useState(false);
  const today = useMemo(() => getTodayISO(), []);
  const keyboard = usePlatformKeyboardLabels();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || !e.shiftKey) return;
      if (e.key.toLowerCase() !== "d") return;

      e.preventDefault();
      setAllowPastDates((prev) => {
        const next = !prev;
        toast.success(
          next
            ? "Past dates enabled — you can pick earlier invoice dates"
            : "Date locked to today only",
          { duration: 2500 }
        );
        return next;
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const minDate = allowPastDates ? undefined : today;
  const maxDate = today;

  const handleFormKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key !== "Enter" || e.shiftKey || e.metaKey || e.ctrlKey) return;

      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA") return;
      if (isSelectMenuOpen(target)) return;

      const form = formRef.current;
      if (!form) return;

      const moved = focusNextEnterNavField(form, target);
      if (moved) {
        e.preventDefault();
        return;
      }

      if (target.closest("[data-enter-nav]") && onEnterAtLastField) {
        e.preventDefault();
        onEnterAtLastField();
      }
    },
    [onEnterAtLastField]
  );

  return {
    formRef,
    allowPastDates,
    today,
    minDate,
    maxDate,
    handleFormKeyDown,
    dateHint: keyboard.togglePastDatesHint(allowPastDates),
    keyboard,
  };
}
