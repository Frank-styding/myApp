import { create } from "zustand";

interface ConfigState {
  hasUpdated: boolean;
  setUpdated: (value: boolean) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  hasUpdated: false,
  setUpdated: (value) => set({ hasUpdated: value }),
}));
