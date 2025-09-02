import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendData } from "@/lib/sendData";
import uuid from "react-native-uuid";
import NetInfo from "@react-native-community/netinfo";
import { BackgroundState } from "@/lib/backgroundState";

const BATCHES_KEY = "pendingBatches";

export const loadBatches = async (): Promise<Map<string, any[]>> => {
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

export const createBatchesFromQueue = async () => {
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

export const processStoredBatches = async () => {
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
