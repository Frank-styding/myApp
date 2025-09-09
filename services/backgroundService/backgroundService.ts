import NetInfo from "@react-native-community/netinfo";
import BackgroundService from "react-native-background-actions";
import { backgroundTask } from "./backgroundTask";

// Flag to prevent concurrent execution of the background task
let isTaskExecuting = false;

// Main background service function for data synchronization
export const backgroundSendTask = async (taskData?: {
  delay: number;
  action?: string;
}) => {
  // Extract delay and action from task data, default to 30 seconds delay
  const { delay, action } = taskData ?? { delay: 30000 };

  // Handle stop action
  if (action === "Detener") {
    console.log("[TASK]: 🛑 Stopping synchronization");
    await BackgroundService.stop();
    return;
  }

  // Main task loop - runs while background service is active
  while (await BackgroundService.isRunning()) {
    // Skip iteration if task is already executing
    if (isTaskExecuting) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    // Set execution flag to prevent concurrent runs
    isTaskExecuting = true;

    try {
      // Check internet connectivity
      const state = await NetInfo.fetch();
      const hasInternet = state.isConnected;

      // Execute the background task and check if it completed all work
      const complete = await backgroundTask(hasInternet);

      // Stop service if no more work remains
      if (complete) {
        console.log("[TASK]:📭 No pending work - stopping service");
        await BackgroundService.stop();
        break;
      }
    } catch (err) {
      console.error("[TASK]:❌ Error in background task:", err);
    } finally {
      // Reset execution flag
      isTaskExecuting = false;
    }

    // Wait for specified delay before next iteration
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};
