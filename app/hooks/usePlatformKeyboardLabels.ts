"use client";

import { useMemo, useSyncExternalStore } from "react";

/** Detect macOS / iOS at runtime — used for keyboard hint labels only. */
export function detectMacPlatform(): boolean {
  if (typeof navigator === "undefined") return false;

  const platform = navigator.platform || "";
  const ua = navigator.userAgent || "";

  if (/Mac|iPhone|iPad|iPod/i.test(platform)) return true;
  if (/Macintosh|Mac OS X/i.test(ua)) return true;

  // iPadOS 13+ may report desktop Safari as MacIntel.
  if (platform === "MacIntel" && navigator.maxTouchPoints > 1) return true;

  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const uaPlatform = nav.userAgentData?.platform;
  if (typeof uaPlatform === "string" && /macOS|iOS/i.test(uaPlatform)) return true;

  return false;
}

function subscribePlatform() {
  return () => {};
}

function getServerPlatformSnapshot() {
  return false;
}

function getClientPlatformSnapshot() {
  return detectMacPlatform();
}

export function useIsMacPlatform() {
  return useSyncExternalStore(
    subscribePlatform,
    getClientPlatformSnapshot,
    getServerPlatformSnapshot
  );
}

export type PlatformKeyboardLabels = {
  isMac: boolean;
  modKey: string;
  togglePastDates: string;
  searchMenu: string;
  togglePastDatesHint: (allowPastDates: boolean) => string;
  pastDatesValidationMessage: string;
  editRateKey: string;
  editGstKey: string;
  editRateTitle: string;
  editGstTitle: string;
  rateEditableToast: string;
  gstEditableToast: string;
};

export function buildPlatformKeyboardLabels(isMac: boolean): PlatformKeyboardLabels {
  const modKey = isMac ? "⌘" : "Ctrl";
  const togglePastDates = `${modKey}+Shift+D`;
  const searchMenu = `${modKey}+K`;

  return {
    isMac,
    modKey,
    togglePastDates,
    searchMenu,
    togglePastDatesHint: (allowPastDates: boolean) =>
      allowPastDates
        ? `Past dates enabled · ${togglePastDates} to lock to today`
        : `To enable past dates · ${togglePastDates}`,
    pastDatesValidationMessage: `Only today's date is allowed. Press ${togglePastDates} to enable past dates.`,
    editRateKey: "F2",
    editGstKey: "F3",
    editRateTitle: "Press F2 to edit rate",
    editGstTitle: "Press F3 to change GST slab",
    rateEditableToast: "Rate editable — press F2 again to reset",
    gstEditableToast: "GST editable — press F3 again to reset",
  };
}

export function usePlatformKeyboardLabels(): PlatformKeyboardLabels {
  const isMac = useIsMacPlatform();

  return useMemo(() => buildPlatformKeyboardLabels(isMac), [isMac]);
}
