import NetInfo from "@react-native-community/netinfo";
import BackgroundService from "react-native-background-actions";
import { backgroundTask } from "./backgroundTask";

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
      /*  const state = await NetInfo.fetch(); */
      /*   const hasInternet = state.isConnected && state.isInternetReachable; */
      //--------------------------------------------------------------------
      /*  const batches = await loadBatches(); */
      /*     const hasWork = await BackgroundState.hasPendingWork(batches); */
      /*       if (!hasWork) {
        if (hasInternet) {
          console.log("[TASK]:📭 Nada pendiente - deteniendo servicio");
          await BackgroundService.stop();
          break;
        }
      } else {
        await createBatchesFromQueue();
        await processStoredBatches();
      } */
      //---------------------------------------------------------------
      const state = await NetInfo.fetch();
      const hasInternet = state.isConnected && state.isInternetReachable;
      const complete = await backgroundTask(hasInternet);
      if (complete) {
        console.log("[TASK]:📭 Nada pendiente - deteniendo servicio");
        await BackgroundService.stop();
        break;
      }
    } catch (err) {
      console.error("[TASK]:❌ Error en tarea background:", err);
    } finally {
      isTaskExecuting = false;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};
