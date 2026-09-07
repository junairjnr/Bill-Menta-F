import { FY } from "@/app/types";
import { create } from "zustand";

const FY_STORAGE_KEY = "ACTIVE_FY_ID";

interface FYStore {
  activeFY: FY | null;
  setActiveFY: (fy: FY) => void;
  getActiveFYId: () => string | null;
}

export const useFYStore = create<FYStore>((set, get) => ({
  activeFY: null,
  setActiveFY: (fy) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(FY_STORAGE_KEY, fy._id);
    }
    set({ activeFY: fy });
  },
  getActiveFYId: () => {
    const fromStore = get().activeFY?._id;
    if (fromStore) return fromStore;
    if (typeof window !== "undefined") {
      return localStorage.getItem(FY_STORAGE_KEY);
    }
    return null;
  },
}));

export { FY_STORAGE_KEY };
