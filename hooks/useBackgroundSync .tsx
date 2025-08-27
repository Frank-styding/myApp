import NetInfo from "@react-native-community/netinfo";
import { PermissionsAndroid, Platform } from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";
import BackgroundService from "react-native-background-actions";
import { sendData } from "@/lib/SendData";
import { useAppState, QueueItem } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BATCH_RETRY_KEY = "batchRetryCount";

// Cargar contadores persistentes
const loadBatchRetryCount = async (): Promise<Map<string, number>> => {
  try {
    const stored = await AsyncStorage.getItem(BATCH_RETRY_KEY);
    return new Map(JSON.parse(stored || "[]"));
  } catch {
    return new Map();
  }
};

// Guardar contadores persistentes
const saveBatchRetryCount = async (count: Map<string, number>) => {
  await AsyncStorage.setItem(BATCH_RETRY_KEY, JSON.stringify([...count]));
};

const processPendingRequests = async () => {
  const { requests, deleteRequest } = useAppState.getState();
  if (requests.length === 0) return;

  const batchRetryCount = await loadBatchRetryCount();
  console.log(`[TASK]:Procesando ${requests.length} requests pendientes...`);
  // Agrupar requests por lugar y DNI
  const groupedRequests: Record<string, Record<string, QueueItem[]>> = {};

  requests.forEach((item) => {
    if (!groupedRequests[item.place]) groupedRequests[item.place] = {};
    if (!groupedRequests[item.place][item.dni])
      groupedRequests[item.place][item.dni] = [];
    groupedRequests[item.place][item.dni].push(item);
  });

  for (const place in groupedRequests) {
    for (const dni in groupedRequests[place]) {
      const batch = groupedRequests[place][dni];
      const batchId = `${place}-${dni}`;

      try {
        const { name } = batch[0];

        // solo enviar si hay internet
        const state = await NetInfo.fetch();
        if (!(state.isConnected && state.isInternetReachable)) {
          console.log("[TASK]: Sin conexión, esperando...");
          continue;
        }

        const result = await sendData({
          dni,
          place,
          name,
          data: batch.map((item) => ({
            time: item.time,
            state: item.state,
            id: item.id,
          })),
        });

        if (result.ok) {
          batch.forEach((item) => deleteRequest(item.id));
          batchRetryCount.delete(batchId);
          console.log(`[TASK]:✅ Batch ${batchId} enviado exitosamente`);
        } else {
          const currentCount = batchRetryCount.get(batchId) || 0;
          batchRetryCount.set(batchId, currentCount + 1);
          console.log(
            `[TASK]:❌ Error en batch ${batchId}. Reintentos: ${
              currentCount + 1
            }`
          );
        }
      } catch (error) {
        const currentCount = batchRetryCount.get(batchId) || 0;
        batchRetryCount.set(batchId, currentCount + 1);
        console.error(`[TASK]:⚠️ Error en batch ${batchId}:`, error);
      }
      await saveBatchRetryCount(batchRetryCount);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

export const backgroundSendTask = async (taskData?: { delay: number }) => {
  const { delay } = taskData ?? { delay: 1000 }; // valor por defecto
  while (await BackgroundService.isRunning()) {
    try {
      const { requests } = useAppState.getState();
      console.log(requests);
      if (requests.length === 0) {
        await new Promise((r) => setTimeout(r, delay)); // usa el mismo delay que definiste
        continue;
      }
      await processPendingRequests();
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (err) {
      console.error("[TASK]:Error en background task:", err);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export const useBackgroundSync = () => {
  const [isRunning, setIsRunning] = useState(false);
  const taskRunningRef = useRef(false);

  const checkPermissions = useCallback(async () => {
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // en iOS o Android < 13 no hace falta
  }, []);

  const startBackgroundTask = useCallback(async () => {
    if (taskRunningRef.current) return;

    const options = {
      taskName: "DataSyncTask",
      taskTitle: "Sincronizando datos",
      taskDesc: "Enviando datos pendientes...",
      taskIcon: { name: "ic_launcher", type: "mipmap" },
      color: "#00ff00",
      parameters: { delay: 15000 },
      ...(Platform.OS === "android" && {
        notificationId: 123,
        notificationChannel: "BackgroundSync",
      }),
    };

    try {
      await BackgroundService.start(backgroundSendTask, options);
      taskRunningRef.current = true;
      setIsRunning(true);
      console.log("[TASK]:🚀 Servicio en segundo plano iniciado");
    } catch (e) {
      console.error("[TASK]:Error iniciando servicio:", e);
    }
  }, []);

  const stopBackgroundTask = useCallback(async () => {
    try {
      await BackgroundService.stop();
      taskRunningRef.current = false;
      setIsRunning(false);
      console.log("[TASK]:🛑 Servicio detenido");
    } catch (e) {
      console.error("[TASK]:Error deteniendo servicio:", e);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (taskRunningRef.current) {
        stopBackgroundTask();
      }
    };
  }, [stopBackgroundTask]);

  return {
    isRunning,
    startBackgroundTask,
    stopBackgroundTask,
    checkPermissions,
  };
};
