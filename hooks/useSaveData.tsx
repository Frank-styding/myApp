import { sendData } from "@/lib/SendData";
import { useAppState } from "@/store/store";
import { getCurrentTime } from "@/utils/getCurrentTime";
import NetInfo from "@react-native-community/netinfo";
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

    try {
      const netState = await NetInfo.fetch();
      const isConnected = netState.isConnected && netState.isInternetReachable;

      if (!isConnected) {
        await addRequest(
          {
            dni: data.dni as string,
            name: data.name as string,
            place: data.value as string,
            state,
          },
          callback
        );
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      await sendData({
        dni: data.dni as string,
        name: data.name as string,
        place: data.value as string,
        data: [
          {
            state,
            time: getCurrentTime(),
          },
        ],
      });
      callback?.();
    } catch (error) {
      //console.error("Error en saveData:", error);

      // En caso de error, agregar a la cola para reintento
      await addRequest(
        {
          dni: data.dni as string,
          name: data.name as string,
          place: data.value as string,
          state,
        },
        callback
      );
    } finally {
      setIsSaving(false);
    }
  };

  return { saveData, isSaving };
};
