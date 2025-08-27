// hooks/useModal.ts
import { useCallback, useState } from "react";

export type ModalType = "change" | "error" | "return" | "validation";

export interface ModalState {
  change: {
    visible: boolean;
  };
  error: {
    visible: boolean;
    message: string;
  };
  return: {
    visible: boolean;
    title: string;
    message: string;
  };
  validation: {
    visible: boolean;
    message: string;
  };
}

interface ModalActions {
  showModal: (type: ModalType, data?: any) => void;
  hideModal: (type: ModalType) => void;
  modals: ModalState;
}

export const useModal = (): ModalActions => {
  const [modals, setModals] = useState<ModalState>({
    change: { visible: false },
    error: { visible: false, message: "" },
    validation: { visible: false, message: "" },
    return: { visible: false, title: "", message: "" },
  });

  const showModal = useCallback((type: ModalType, data?: any) => {
    setModals((prev) => {
      switch (type) {
        case "change":
          return { ...prev, change: { visible: true } };
        case "error":
          return { ...prev, error: { visible: true, message: data || "" } };
        case "validation":
          return {
            ...prev,
            validation: { visible: true, message: data || "" },
          };
        case "return":
          return {
            ...prev,
            return: {
              visible: true,
              title: data?.title || "",
              message: data?.message || "",
            },
          };
        default:
          return prev;
      }
    });
  }, []);

  const hideModal = useCallback((type: ModalType) => {
    setModals((prev) => {
      switch (type) {
        case "change":
          return { ...prev, change: { visible: false } };
        case "error":
          return { ...prev, error: { ...prev.error, visible: false } };
        case "return":
          return { ...prev, return: { ...prev.return, visible: false } };
        case "validation":
          return {
            ...prev,
            validation: { ...prev.validation, visible: false },
          };
        default:
          return prev;
      }
    });
  }, []);

  return {
    modals,
    showModal,
    hideModal,
  };
};
