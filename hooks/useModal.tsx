/* // hooks/useModal.ts
import { useCallback, useState } from "react";

export type ModalType =
  | "change"
  | "error"
  | "return"
  | "message"
  | "loading"
  | "end"
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
  end: {
    visible: boolean;
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
    end: { visible: false },
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
          case "end":
            return {
              ...prev,
              end: { visible: true },
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
        case "end":
          return {
            ...prev,
            end: { visible: false },
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
 */

// store/modalStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ModalType =
  | "change"
  | "error"
  | "return"
  | "message"
  | "loading"
  | "end"
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
  end: {
    visible: boolean;
  };
}

export interface ModalStore {
  modals: ModalState;
  showModal: (
    type: ModalType,
    data?: any,
    callback?: (data?: any) => void
  ) => void;
  hideModal: (type: ModalType) => void;
}

const initialState: ModalState = {
  change: { visible: false },
  error: { visible: false, message: "" },
  message: { visible: false, message: "" },
  validation: { visible: false, message: "" },
  return: { visible: false, title: "", message: "" },
  loading: { visible: false, message: "Cargando..." },
  end: { visible: false },
};

export const useModal = create<ModalStore>()(
  persist(
    (set) => ({
      modals: initialState,

      showModal: (type, data, callback) =>
        set((state) => {
          const updated = { ...state.modals };

          switch (type) {
            case "change":
              updated.change = { visible: true };
              break;
            case "error":
              updated.error = { visible: true, message: data || "" };
              break;
            case "message":
              updated.message = { visible: true, message: data || "" };
              break;
            case "validation":
              updated.validation = {
                visible: true,
                message: data || "",
                callback,
              };
              break;
            case "end":
              updated.end = { visible: true };
              break;
            case "return":
              updated.return = {
                visible: true,
                title: data?.title || "",
                message: data?.message || "",
              };
              break;
            case "loading":
              updated.loading = {
                visible: true,
                message: data || "Cargando...",
              };
              break;
          }

          return { modals: updated };
        }),

      hideModal: (type) =>
        set((state) => {
          const updated = { ...state.modals };

          switch (type) {
            case "change":
              updated.change = { visible: false };
              break;
            case "error":
              updated.error = { ...updated.error, visible: false };
              break;
            case "return":
              updated.return = { ...updated.return, visible: false };
              break;
            case "message":
              updated.message = { ...updated.message, visible: false };
              break;
            case "end":
              updated.end = { visible: false };
              break;
            case "validation":
              updated.validation = { ...updated.validation, visible: false };
              break;
            case "loading":
              updated.loading = { ...updated.loading, visible: false };
              break;
          }

          return { modals: updated };
        }),
    }),
    {
      name: "modal-store", // clave en AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // ⚠️ No persistimos funciones como callback
        modals: {
          ...state.modals,
          validation: {
            ...state.modals.validation,
            callback: undefined,
          },
        },
      }),
    }
  )
);
