import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendData } from "@/lib/sendData";
import uuid from "react-native-uuid";
import NetInfo from "@react-native-community/netinfo";
import { BackgroundState } from "@/lib/backgroundState";

// Key for storing pending batches in AsyncStorage
const BATCHES_KEY = "pendingBatches";

// Load pending batches from storage
export const loadBatches = async (): Promise<Map<string, any[]>> => {
  try {
    const stored = await AsyncStorage.getItem(BATCHES_KEY);
    return new Map(JSON.parse(stored || "[]"));
  } catch {
    return new Map();
  }
};

// Save batches to storage
const saveBatches = async (batches: Map<string, any[]>) => {
  await AsyncStorage.setItem(BATCHES_KEY, JSON.stringify([...batches]));
};

// Create batches from queued requests, grouped by place and DNI
export const createBatchesFromQueue = async () => {
  const requests = await BackgroundState.getRequests();
  if (requests.length === 0) return;

  const batches = await loadBatches();
  const grouped: Record<string, Record<string, any[]>> = {};

  // Group requests by place and DNI
  requests.forEach((item) => {
    if (!grouped[item.place]) grouped[item.place] = {};
    if (!grouped[item.place][item.dni]) grouped[item.place][item.dni] = [];
    grouped[item.place][item.dni].push(item);
  });

  // Create batches from grouped requests
  for (const place in grouped) {
    for (const dni in grouped[place]) {
      const batch = grouped[place][dni];
      const batchId = uuid.v4();

      if (!batches.has(batchId)) {
        batches.set(batchId, batch);
        // Remove each item from the queue after batching
        for (const item of batch) {
          await BackgroundState.deleteRequest(item.id);
        }
        console.log(`[TASK]:📦 Batch ${batchId} created and stored`);
      }
    }
  }
  await saveBatches(batches);
};

// Process and send stored batches to the server
export const processStoredBatches = async () => {
  const batches = await loadBatches();
  if (batches.size === 0) return;

  // Process each batch
  for (const [batchId, batch] of batches.entries()) {
    try {
      const { place, dni, name } = batch[0];

      // Check internet connection before sending
      const state = await NetInfo.fetch();
      if (!(state.isConnected && state.isInternetReachable)) {
        console.log("[TASK]:❌ No connection, waiting...");
        continue;
      }

      // Send batch data to server
      const result = await sendData({
        place,
        dni,
        name,
        data: batch,
        id: batchId,
      });

      // Remove batch if successfully sent
      if (result.ok) {
        batches.delete(batchId);
        console.log(`[TASK]:✅ Batch ${batchId} sent and deleted`);
      } else {
        console.log(`[TASK]:⚠️ Error in batch ${batchId}, will retry`);
      }
    } catch (error) {
      console.error(`[TASK]:⚠️ Exception in batch ${batchId}:`, error);
    }
    await saveBatches(batches);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
