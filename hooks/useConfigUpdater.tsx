import { getAppConfig } from "@/lib/getAppConfig";
import { useAppState } from "@/store/store";
import { useEffect } from "react";
import { useConfigStore } from "@/store/useConfigStore";
import { useModalContext } from "./ModalProvider";

export function useConfigUpdater(hasConnection: boolean) {
  const { showModal, hideModal } = useModalContext();
  const { hasUpdated, setUpdated } = useConfigStore();

  useEffect(() => {
    const loadConfigOnce = async () => {
      if (!hasConnection) return;
      if (hasUpdated) return; // ya se ejecutó antes ✅

      showModal("loading", "Actualizando Datos");
      try {
        const { config } = await getAppConfig();
        if (config) {
          useAppState.getState().setConfig(config);
        }
        setUpdated(true); // marcar como actualizado
      } catch (error) {
        console.error("Error cargando configuración:", error);
      } finally {
        hideModal("loading");
      }
    };

    loadConfigOnce();
  }, [hasConnection, hasUpdated, setUpdated]);
}
