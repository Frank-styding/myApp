import { useAppState } from "@/store/store";
import { generateUUID } from "@/utils/generateUUID";
import { getCurrentTime } from "@/utils/getCurrentTime";
import { useState } from "react";

export const useSaveData = () => {
  const { addRequest, data: stateData } = useAppState();
  const [isSaving, setIsSaving] = useState(false);

  const saveData = async (
    state: string,
    callback?: () => void,
    nData?: {
      value?: string;
      name?: string;
      dni?: string;
    }
  ) => {
    const data = nData ? nData : stateData;
    setIsSaving(true);
    await addRequest(
      {
        id: generateUUID(),
        time: getCurrentTime(),
        timeNumber: Date.now(),
        dni: data.dni as string,
        name: data.name as string,
        place: data.value as string,
        state,
      },
      callback
    );
    setIsSaving(false);
  };

  return { saveData, isSaving };
};
