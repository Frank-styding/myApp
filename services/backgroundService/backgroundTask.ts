import { BackgroundState } from "@/lib/backgroundState";
import BackgroundService from "react-native-background-actions";
import {
  createBatchesFromQueue,
  loadBatches,
  processStoredBatches,
} from "./sendDataService";

export const backgroundTask = async (
  hasInternet: boolean | null
): Promise<boolean> => {
  const batches = await loadBatches();
  const hasWork = await BackgroundState.hasPendingWork(batches);
  if (!hasWork) {
    if (hasInternet) {
      console.log("[TASK]:📭 Nada pendiente - deteniendo servicio");
      await BackgroundService.stop();
      return true;
    }
  } else {
    await createBatchesFromQueue();
    await processStoredBatches();
  }
  return false;
};
