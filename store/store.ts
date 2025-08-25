import { create } from "zustand";

interface AppState {
  data: { value?: string; name?: string; dni?: string };
  setValue: (data: { value?: string; name?: string; dni?: string }) => void;
}

export const useAppState = create<AppState>((set) => ({
  data: {},
  setValue: (data) => set((state) => ({ data })),
}));
