import { sendData } from "@/lib/SendData";
import { QueueItem, useAppState } from "@/store/store";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef, useState, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";

export const useInternetConnectionHandler = (
  isBackgroundTaskRunning: boolean
) => {
  const { requests, deleteRequest } = useAppState();
  const [isSending, setIsSending] = useState(false);

  // Referencias para controlar el estado sin causar re-renders
  const isSendingRef = useRef(false);
  const retryCountRef = useRef<Record<string, number>>({});
  const lastConnectionState = useRef<boolean | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Función optimizada con useCallback para evitar recreaciones
  const handleSendData = useCallback(async () => {
    // Si ya estamos enviando o hay una tarea en segundo plano, salir
    if (
      isBackgroundTaskRunning ||
      isSendingRef.current ||
      requests.length === 0
    )
      return;

    // Marcar que estamos enviando
    isSendingRef.current = true;
    setIsSending(true);

    const places: Record<string, Record<string, QueueItem[]>> = {};
    const currentRetryCount = { ...retryCountRef.current };

    // Agrupar requests por lugar y DNI
    requests.forEach((item) => {
      if (!places[item.place]) places[item.place] = {};
      if (!places[item.place][item.dni]) places[item.place][item.dni] = [];
      places[item.place][item.dni].push(item);
    });

    try {
      for (const keyPlace in places) {
        for (const keyDni in places[keyPlace]) {
          const nRequests = places[keyPlace][keyDni];
          const batchId = `${keyPlace}-${keyDni}`;

          // Saltar si hemos excedido el máximo de reintentos (3)
          if ((currentRetryCount[batchId] || 0) >= 3) continue;

          const { dni, name, place } = nRequests[0];

          try {
            const result = await sendData({
              dni,
              place,
              name,
              data: nRequests.map((item) => ({
                time: item.time,
                state: item.state,
              })),
            });

            if (result.ok) {
              // Eliminar solicitudes exitosas y resetear contador
              nRequests.forEach((item) => deleteRequest(item.id));
              delete currentRetryCount[batchId];
            } else {
              // Incrementar contador de reintentos en caso de error
              currentRetryCount[batchId] =
                (currentRetryCount[batchId] || 0) + 1;
            }
          } catch (error) {
            // Incrementar contador en caso de excepción
            currentRetryCount[batchId] = (currentRetryCount[batchId] || 0) + 1;
          }
        }
      }
    } finally {
      // Actualizar referencia de reintentos
      retryCountRef.current = currentRetryCount;
      // Restablecer estado de envío
      isSendingRef.current = false;
      setIsSending(false);
    }
  }, [requests, deleteRequest, isBackgroundTaskRunning]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // Si la aplicación pasa de background/inactive a active
      if (
        (appStateRef.current === "background" ||
          appStateRef.current === "inactive") &&
        nextAppState === "active"
      ) {
        // Verificar si hay conexión a internet
        NetInfo.fetch().then((state) => {
          const isConnected = state.isConnected && state.isInternetReachable;
          if (isConnected) {
            // Ejecutar el envío de datos después de un breve retraso
            setTimeout(() => {
              handleSendData();
            }, 1000);
          }
        });
      }

      // Actualizar la referencia del estado de la aplicación
      appStateRef.current = nextAppState;
    };

    // Suscribirse a cambios en el estado de la aplicación
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      appStateSubscription.remove();
    };
  }, [handleSendData]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const isConnected = state.isConnected && state.isInternetReachable;

      // Solo procesar si el estado de conexión cambió a conectado
      if (isConnected && lastConnectionState.current !== isConnected) {
        // Esperar un breve momento para estabilizar la conexión
        await new Promise((resolve) => setTimeout(resolve, 1000));
        handleSendData();
      }

      // Actualizar el último estado de conexión
      lastConnectionState.current = isConnected;
    });

    return () => unsubscribe();
  }, [handleSendData]);

  return { isSending };
};
