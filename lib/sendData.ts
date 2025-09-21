import { getFormattedDate } from "@/utils/getFormattedDate";
import NetInfo from "@react-native-community/netinfo";
import Constants from "expo-constants";
//import uuid from "react-native-uuid"; // Instala uuid si no lo tienes

export const sendData = async ({
  place,
  name,
  dni,
  data,
  id,
}: {
  place: string;
  name: string;
  dni: string;
  id?: string;
  data: {
    time: string;
    state: string;
    id?: string;
    timeNumber?: number;
    reason?: number;
  }[];
}): Promise<{ ok: boolean; status?: number; body?: any }> => {
  const apiUrl = Constants.expoConfig?.extra?.API_URL;
  if (!apiUrl) {
    console.warn("sendData: apiUrl no configurada");
    return { ok: false };
  }

  const netState = await NetInfo.fetch();
  if (!netState.isConnected) {
    console.warn("sendData: Sin conexión a internet");
    return { ok: false };
  }

  const interval = 800;
  const maxRetries = 20;
 /*  const id = uuidv4(); */
  const timestamp = Date.now();

  for (let i = 0; i < maxRetries; i++) {
    try {
      const payload = {
        type: "insert:format_1",
        timestamp,
        id,
        data: {
          spreadsheetName: "cosecha_" + getFormattedDate(),
          sheetName: `fundo_${place}`,
          data: {
            tableName: dni,
            tableData: {
              dni: dni,
              capitan: name, // corregido a "capitan" como en Python
            },
            items: data.map((item) => ({
              inicio: item.time,
              estado: item.state,
              razón: item.reason,
              _time: item.timeNumber,
            })),
          },
        },
      };

      const resp = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await resp.json().catch(() => null);

      if (resp.ok && json?.success) {
        console.log("Status code:", resp.status);
        console.log("Response:", json);
        return { ok: true, status: resp.status, body: json };
      } else {
        await new Promise((res) => setTimeout(res, interval));
      }
    } catch (err) {
      console.warn(
        `sendData: error consultando isReady - Retry ${i + 1}/${maxRetries}:`,
        err
      );
      await new Promise((res) => setTimeout(res, interval));
    }
  }

  return { ok: false };
};
