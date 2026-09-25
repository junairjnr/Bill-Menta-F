"use client";

import React from "react";
import {
  usePlatformKeyboardLabels,
  type PlatformKeyboardLabels,
} from "@/app/hooks/usePlatformKeyboardLabels";

type InvoiceFormKeyboardHintsProps = {
  allowPastDates?: boolean;
  keyboard?: PlatformKeyboardLabels;
};

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] text-gray-600">
    {children}
  </kbd>
);

export default function InvoiceFormKeyboardHints({
  allowPastDates = false,
  keyboard: keyboardProp,
}: InvoiceFormKeyboardHintsProps) {
  const detectedKeyboard = usePlatformKeyboardLabels();
  const keyboard = keyboardProp ?? detectedKeyboard;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2 text-xs text-gray-500">
      <span className="inline-flex items-center gap-1">
        <Kbd>Enter</Kbd> next field
      </span>
      <span className="inline-flex items-center gap-1">
        <Kbd>{keyboard.togglePastDates}</Kbd>
        {allowPastDates ? "lock to today" : "allow past dates"}
      </span>
      <span className="inline-flex items-center gap-1">
        <Kbd>{keyboard.editRateKey}</Kbd> on rate to edit line price
      </span>
      <span className="inline-flex items-center gap-1">
        <Kbd>{keyboard.editGstKey}</Kbd> on GST % to change tax slab
      </span>
      <span className="inline-flex items-center gap-1">
        <Kbd>Enter</Kbd> on last item row adds a new line
      </span>
    </div>
  );
}
