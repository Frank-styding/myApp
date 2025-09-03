// hooks/useModal.ts
import { useCallback, useState } from "react";

export type ModalType =
  | "change"
  | "error"
  | "return"
  | "message"
  | "loading"
  | "validation";

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
  message: {
    visible: boolean;
    message: string;
  };
  validation: {
    visible: boolean;
    message: string;
    callback?: (data?: any) => void;
  };
  loading: {
    visible: boolean;
    message: string;
  };
}

interface ModalActions {
  showModal: (
    type: ModalType,
    data?: any,
    callback?: (data?: any) => void
  ) => void;
  hideModal: (type: ModalType) => void;
  modals: ModalState;
}

export const useModal = (): ModalActions => {
  const [modals, setModals] = useState<ModalState>({
    change: { visible: false },
    error: { visible: false, message: "" },
    message: { visible: false, message: "" },
    validation: { visible: false, message: "" },
    return: { visible: false, title: "", message: "" },
    loading: { visible: false, message: "Cargando..." },
  });

  const showModal = useCallback(
    (type: ModalType, data?: any, callback?: () => void) => {
      setModals((prev) => {
        switch (type) {
          case "change":
            return { ...prev, change: { visible: true } };
          case "error":
            return { ...prev, error: { visible: true, message: data || "" } };
          case "message":
            return {
              ...prev,
              message: { visible: true, message: data || "" },
            };
          case "validation":
            return {
              ...prev,
              validation: { visible: true, message: data || "", callback },
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
          case "loading":
            return {
              ...prev,
              loading: { visible: true, message: data || "Cargando..." },
            };
          default:
            return prev;
        }
      });
    },
    []
  );

  const hideModal = useCallback((type: ModalType) => {
    setModals((prev) => {
      switch (type) {
        case "change":
          return { ...prev, change: { visible: false } };
        case "error":
          return { ...prev, error: { ...prev.error, visible: false } };
        case "return":
          return { ...prev, return: { ...prev.return, visible: false } };
        case "message":
          return {
            ...prev,
            message: { ...prev.message, visible: false },
          };
        case "validation":
          return {
            ...prev,
            validation: { ...prev.message, visible: false },
          };
        case "loading":
          return { ...prev, loading: { ...prev.loading, visible: false } };
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
