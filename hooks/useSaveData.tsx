/* import { useAppState } from "@/store/store"; */
import { getCurrentTime } from "@/utils/getCurrentTime";
import { useBackgroundSync } from "./useBackgroundSync";

export const useSaveData = () => {
  const { isRunning, startBackgroundTask, addRequest } = useBackgroundSync();
  /* const { addRequest, data: stateData } = useAppState(); */

  const saveData = async (
    state: string,
    data: {
      value?: string;
      name?: string;
      dni?: string;
    },
    callback?: () => void
  ) => {
    console.log(data);
    await addRequest({
      time: getCurrentTime(),
      dni: data.dni as string,
      name: data.name as string,
      place: data.value as string,
      state,
    }).then(() => {
      callback?.();
    });
    console.log(isRunning);
    if (!isRunning) {
      await startBackgroundTask();
    }
  };

  return { saveData };
};
