/* import NetInfo from "@react-native-community/netinfo";
import { PermissionsAndroid, Platform } from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";
import BackgroundService from "react-native-background-actions";
import { useAppState, QueueItem } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendData } from "@/lib/sendData";
import uuid from "react-native-uuid";
const BATCHES_KEY = "pendingBatches";

// ---- Helpers para batches ----
const loadBatches = async (): Promise<Map<string, QueueItem[]>> => {
  try {
    const stored = await AsyncStorage.getItem(BATCHES_KEY);
    return new Map(JSON.parse(stored || "[]"));
  } catch {
    return new Map();
  }
};

const saveBatches = async (batches: Map<string, QueueItem[]>) => {
  await AsyncStorage.setItem(BATCHES_KEY, JSON.stringify([...batches]));
};

const hasPendingWork = async () => {
  const { requests } = useAppState.getState();
  if (requests.length > 0) return true;

  const batches = await loadBatches();
  return batches.size > 0;
};

const createBatchesFromQueue = async () => {
  const { requests, deleteRequest } = useAppState.getState();
  const batches = await loadBatches();
  if (requests.length === 0) return;

  const grouped: Record<string, Record<string, QueueItem[]>> = {};

  requests.forEach((item) => {
    if (!grouped[item.place]) grouped[item.place] = {};
    if (!grouped[item.place][item.dni]) grouped[item.place][item.dni] = [];
    grouped[item.place][item.dni].push(item);
  });

  for (const place in grouped) {
    for (const dni in grouped[place]) {
      const batch = grouped[place][dni];
      const batchId = uuid.v4();

      if (!batches.has(batchId)) {
        batches.set(batchId, batch);
        batch.forEach((item) => deleteRequest(item.id));
        console.log(`[TASK]:📦 Batch ${batchId} creado y almacenado`);
      }
    }
  }
  await saveBatches(batches);
  await new Promise((resolve) => setTimeout(resolve, 500));
};

const processStoredBatches = async () => {
  const batches = await loadBatches();
  if (batches.size === 0) return;

  for (const [batchId, batch] of batches.entries()) {
    try {
      const { place, dni, name } = batch[0];

      const state = await NetInfo.fetch();
      if (!(state.isConnected && state.isInternetReachable)) {
        console.log("[TASK]:❌ Sin conexión, esperando...");
        continue;
      }

      const result = await sendData({
        place,
        dni,
        name,
        data: batch,
        id: batchId,
      });

      if (result.ok) {
        batches.delete(batchId);
        console.log(`[TASK]:✅ Batch ${batchId} enviado y eliminado`);
      } else {
        console.log(`[TASK]:⚠️ Error en batch ${batchId}, se reintentará`);
      }
    } catch (error) {
      console.error(`[TASK]:⚠️ Excepción en batch ${batchId}:`, error);
    }
    await saveBatches(batches);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
// ---- Background task ----
let isTaskExecuting = false;
let iteration = 0;
let emptyIterations = 0; // contador de iteraciones sin elementos

export const backgroundSendTask = async (taskData?: {
  delay: number;
  action?: string;
}) => {
  const { delay, action } = taskData ?? { delay: 30000 };
  if (action === "Detener") {
    console.log(
      "[TASK]: 🛑 Usuario pidió detener la sincronización desde la notificación"
    );
    await BackgroundService.stop();
    return;
  }

  while (await BackgroundService.isRunning()) {
    if (isTaskExecuting) {
      console.log(
        `[TASK]:⏸ (${new Date().toLocaleTimeString()}) Iteración en curso, esperando...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    isTaskExecuting = true;
    iteration++;
    console.log(`\n===== [TASK]:🌀 Iteración #${iteration} INICIO =====`);

    try {
      // 🔍 Verificar conexión
      const state = await NetInfo.fetch();
      const hasInternet = state.isConnected && state.isInternetReachable;

      if (!(await hasPendingWork())) {
        if (hasInternet) {
          emptyIterations++;
          console.log(`[TASK]:📭 Nada pendiente (vacío #${emptyIterations}/2)`);

          if (emptyIterations >= 2) {
            console.log(
              "[TASK]:🛑 Sin requests ni batches (y con internet) -> deteniendo servicio"
            );
            await BackgroundService.stop();
            break;
          }
        } else {
          console.log(
            "[TASK]:🌐 Sin internet, no detengo aunque no haya datos"
          );
        }
      } else {
        emptyIterations = 0;

        // Crear nuevos batches
        console.log("[TASK]:📥 Creando nuevos batches...");
        await createBatchesFromQueue();

        // Procesar lo que está guardado
        console.log("[TASK]:📤 Procesando batches almacenados...");
        await processStoredBatches();
      }

      console.log(`[TASK]:✅ Iteración #${iteration} completada`);
    } catch (err) {
      console.error(`[TASK]:❌ Error en iteración #${iteration}:`, err);
    } finally {
      console.log(`===== [TASK]:🏁 Iteración #${iteration} FIN =====\n`);
      isTaskExecuting = false;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};
export const useBackgroundSync = () => {
  const [isRunning, setIsRunning] = useState(false);
  const taskRunningRef = useRef(false);
  const requests = useAppState((state) => state.requests);

  const checkPermissions = useCallback(async () => {
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }, []);

  const startBackgroundTask = useCallback(async () => {
    if (taskRunningRef.current || (await BackgroundService.isRunning())) {
      console.log(
        "[TASK]:⚠️ Servicio ya está corriendo, no se inicia de nuevo"
      );
      return;
    }

    const options = {
      taskName: "DataSyncTask",
      taskTitle: "Sincronizando datos",
      taskDesc: "Enviando datos pendientes...",
      taskIcon: { name: "ic_launcher", type: "mipmap" },
      color: "#00ff00",
      parameters: { delay: 30000 },
      ...(Platform.OS === "android" && {
        notificationId: 123,
        notificationChannel: "BackgroundSync",
        actions: "Detener",
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

  // Efecto para iniciar el servicio cuando hay trabajo pendiente
  useEffect(() => {
    const checkAndStartService = async () => {
      console.log(requests);
      try {
        const hasWork = await hasPendingWork();
        const isServiceRunning = await BackgroundService.isRunning();

        if (hasWork && !isServiceRunning && !taskRunningRef.current) {
          console.log("[TASK]:📌 Trabajo detectado, iniciando servicio");
          await startBackgroundTask();
        }
      } catch (error) {
        console.error("Error verificando trabajo pendiente:", error);
      }
    };

    checkAndStartService();
  }, [requests.length, startBackgroundTask]);

  // Efecto para verificar el estado del servicio periódicamente
  useEffect(() => {
    const interval = setInterval(async () => {
      const isServiceRunning = await BackgroundService.isRunning();
      if (isServiceRunning !== isRunning) {
        setIsRunning(isServiceRunning);
        taskRunningRef.current = isServiceRunning;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Efecto de limpieza al desmontar
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
 */

import { useEffect, useCallback, useState } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import BackgroundService from "react-native-background-actions";
import { backgroundSendTask } from "@/services/backgroundService";
import { BackgroundState } from "@/lib/backgroundState";

export const useBackgroundSync = () => {
  const [isRunning, setIsRunning] = useState(false);

  const checkPermissions = useCallback(async () => {
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }, []);

  const startBackgroundTask = useCallback(async () => {
    if (await BackgroundService.isRunning()) return;

    const options = {
      taskName: "DataSyncTask",
      taskTitle: "Sincronizando datos",
      taskDesc: "Enviando datos pendientes...",
      taskIcon: { name: "ic_launcher", type: "mipmap" },
      color: "#00ff00",
      parameters: { delay: 30000 },
      linkingURI: "yourapp://deeplink",
      ...(Platform.OS === "android" && {
        notificationId: 123,
        notificationChannel: "BackgroundSync",
        actions: "Detener",
      }),
    };

    try {
      await BackgroundService.start(backgroundSendTask, options);
      setIsRunning(true);
    } catch (e) {
      console.error("Error iniciando servicio:", e);
    }
  }, []);

  const stopBackgroundTask = useCallback(async () => {
    try {
      await BackgroundService.stop();
      setIsRunning(false);
    } catch (e) {
      console.error("Error deteniendo servicio:", e);
    }
  }, []);

  // Verificar estado del servicio
  useEffect(() => {
    const checkService = async () => {
      const running = await BackgroundService.isRunning();
      setIsRunning(running);
    };

    checkService();
    const interval = setInterval(checkService, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    isRunning,
    startBackgroundTask,
    stopBackgroundTask,
    checkPermissions,
    addRequest: BackgroundState.addRequest,
    getRequests: BackgroundState.getRequests,
  };
};
