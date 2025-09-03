import { BackgroundState } from "@/lib/backgroundState";
import BackgroundService from "react-native-background-actions";
import {
  createBatchesFromQueue,
  loadBatches,
  processStoredBatches,
} from "./sendDataService";

// Main background task logic for processing pending data
export const backgroundTask = async (
  hasInternet: boolean | null
): Promise<boolean> => {
  // Load pending batches from storage
  const batches = await loadBatches();

  // Check if there's any pending work
  const hasWork = await BackgroundState.hasPendingWork(batches);

  // If no work and internet is available, stop service
  if (!hasWork) {
    if (hasInternet) {
      console.log("[TASK]:📭 No pending work - stopping service");
      await BackgroundService.stop();
      return true;
    }
  } else {
    // Process pending work: create batches and send them
    await createBatchesFromQueue();
    await processStoredBatches();
  }

  // Return false indicating work may still remain
  return false;
};
