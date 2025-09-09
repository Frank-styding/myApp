import { getCurrentTime } from "@/utils/getCurrentTime";
import { useBackgroundSync } from "./useBackgroundSync";

export const useSaveData = () => {
  const { isRunning, startBackgroundTask, addRequest } = useBackgroundSync();
  const saveData = async (
    state: string,
    data: {
      time?: string;
      name?: string;
      place?: string;
      dni?: string;
      reason?: string;
      password?: string;
    },
    callback?: () => void
  ) => {
    await addRequest({
      time: data.time !== undefined ? data.time : getCurrentTime(),
      dni: data.dni as string,
      name: data.name as string,
      place: data.place as string,
      reason: (data.reason as string) || " ",
      state,
    }).then(() => {
      callback?.();
    });
    if (!isRunning) {
      await startBackgroundTask();
    }
  };
  return { saveData };
};
