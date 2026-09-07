// store/branch.store.ts
import { create } from "zustand";
import { Branch } from "../../types/index";

interface BranchStore {
  activeBranch: Branch | null;
  setActiveBranch: (branch: Branch) => void;
}

export const useBranchStore = create<BranchStore>((set) => ({
  activeBranch: null,
  setActiveBranch: (branch) => set({ activeBranch: branch }),
}));
