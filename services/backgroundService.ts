import NetInfo from "@react-native-community/netinfo";
import BackgroundService from "react-native-background-actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendData } from "@/lib/sendData";
import uuid from "react-native-uuid";
import { BackgroundState } from "@/lib/backgroundState";

const BATCHES_KEY = "pendingBatches";

// ---- Helpers para batches ----
const loadBatches = async (): Promise<Map<string, any[]>> => {
  try {
    const stored = await AsyncStorage.getItem(BATCHES_KEY);
    return new Map(JSON.parse(stored || "[]"));
  } catch {
    return new Map();
  }
};

const saveBatches = async (batches: Map<string, any[]>) => {
  await AsyncStorage.setItem(BATCHES_KEY, JSON.stringify([...batches]));
};

const createBatchesFromQueue = async () => {
  const requests = await BackgroundState.getRequests();
  if (requests.length === 0) return;

  const batches = await loadBatches();
  const grouped: Record<string, Record<string, any[]>> = {};

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
        // Eliminar cada item del batch
        for (const item of batch) {
          await BackgroundState.deleteRequest(item.id);
        }
        console.log(`[TASK]:📦 Batch ${batchId} creado y almacenado`);
      }
    }
  }
  await saveBatches(batches);
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

export const backgroundSendTask = async (taskData?: {
  delay: number;
  action?: string;
}) => {
  const { delay, action } = taskData ?? { delay: 30000 };

  if (action === "Detener") {
    console.log("[TASK]: 🛑 Deteniendo sincronización");
    await BackgroundService.stop();
    return;
  }

  while (await BackgroundService.isRunning()) {
    if (isTaskExecuting) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    isTaskExecuting = true;

    try {
      // Verificar conexión
      const state = await NetInfo.fetch();
      const hasInternet = state.isConnected && state.isInternetReachable;
      const batches = await loadBatches();
      const hasWork = await BackgroundState.hasPendingWork(batches);

      if (!hasWork) {
        if (hasInternet) {
          console.log("[TASK]:📭 Nada pendiente - deteniendo servicio");
          await BackgroundService.stop();
          break;
        }
      } else {
        // Crear nuevos batches
        await createBatchesFromQueue();

        // Procesar batches almacenados
        await processStoredBatches();
      }
    } catch (err) {
      console.error("[TASK]:❌ Error en tarea background:", err);
    } finally {
      isTaskExecuting = false;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};
