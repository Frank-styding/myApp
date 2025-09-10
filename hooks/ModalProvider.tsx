// providers/ModalProvider.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { ModalStore, useModal } from "@/hooks/useModal";

//interface ModalContextType extends ReturnType<ModalStore> {}

const ModalContext = createContext<ModalStore | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const modalControls = useModal();

  return (
    <ModalContext.Provider value={modalControls}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext debe usarse dentro de ModalProvider");
  }
  return context;
};
