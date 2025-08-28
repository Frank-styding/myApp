import NetInfo from "@react-native-community/netinfo";
import { PermissionsAndroid, Platform } from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";
import BackgroundService from "react-native-background-actions";
import { useAppState, QueueItem } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateUUID } from "@/utils/generateUUID";
import { sendData } from "@/lib/sendData";

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
      const batchId = generateUUID();

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

export const backgroundSendTask = async (taskData?: { delay: number }) => {
  const { delay } = taskData ?? { delay: 30000 };

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
    const startTime = new Date().toLocaleTimeString();
    console.log(
      `\n===== [TASK]:🌀 Iteración #${iteration} INICIO (${startTime}) =====`
    );

    try {
      // Crear batches si hay requests
      const { requests } = useAppState.getState();
      if (requests.length === 0) {
        emptyIterations++;
        console.log(
          `[TASK]:📭 No hay elementos en cola (vacío #${emptyIterations}/3)`
        );

        if (emptyIterations >= 3) {
          console.log(
            "[TASK]:🛑 No hay datos en 3 ciclos, deteniendo servicio"
          );
          await BackgroundService.stop();
          break; // salimos del while
        }
      } else {
        emptyIterations = 0; // reset si entraron nuevos elementos
        console.log("[TASK]:📥 Creando nuevos batches...");
        await createBatchesFromQueue();

        console.log("[TASK]:📤 Procesando batches almacenados...");
        await processStoredBatches();
      }

      console.log(`[TASK]:✅ Iteración #${iteration} completada`);
    } catch (err) {
      console.error(`[TASK]:❌ Error en iteración #${iteration}:`, err);
    } finally {
      const endTime = new Date().toLocaleTimeString();
      console.log(
        `===== [TASK]:🏁 Iteración #${iteration} FIN (${endTime}) =====\n`
      );
      isTaskExecuting = false;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};

export const useBackgroundSync = () => {
  const [isRunning, setIsRunning] = useState(false);
  const taskRunningRef = useRef(false);
  const { requests } = useAppState(); // 👈 escuchamos la cola en el store

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

  // 🔄 Si hay nuevos elementos y el servicio está apagado -> arrancar
  useEffect(() => {
    if (requests.length > 0 && !isRunning) {
      console.log("[TASK]:📌 Nuevos elementos detectados, iniciando servicio");
      startBackgroundTask();
    }
  }, [requests, isRunning, startBackgroundTask]);

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
