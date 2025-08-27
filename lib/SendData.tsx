// SendData.ts
import { getFormattedDate } from "@/utils/getFormattedDate";
import NetInfo from "@react-native-community/netinfo";
import Constants from "expo-constants";
export const sendData = async ({
  place,
  name,
  dni,
  data,
}: {
  place: string;
  name: string;
  dni: string;
  data: { time: string; state: string; id?: string }[];
}): Promise<{ ok: boolean; status?: number; body?: any }> => {
  const apiUrl = Constants.expoConfig?.extra?.API_URL;

  if (!apiUrl) {
    console.warn("sendData: apiUrl no configurada");
    return { ok: false };
  }

  // Verificar conexión antes de intentar el envío
  const netState = await NetInfo.fetch();
  if (!netState.isConnected || !netState.isInternetReachable) {
    console.warn("sendData: Sin conexión a internet");
    return { ok: false };
  }

  try {
    // Agregar timeout para evitar que la solicitud se quede colgada
    /*    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout
 */
    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        type: "insertFormat_1",
        data: {
          spreadsheetName: "cosecha_" + getFormattedDate(),
          sheetName: `fundo_${place}`,
          data: {
            tableName: dni,
            tableData: {
              dni: dni,
              capitan: name,
            },
            items: data.map((item) => ({
              inicio: item.time,
              estado: item.state,
            })),
          },
        },
        timestamp: Math.floor(Date.now() / 1000),
      }),
      /*       signal: controller.signal, */
    });

    /*  clearTimeout(timeoutId); */

    const body = await resp.text().catch(() => null);

    if (!resp.ok) {
      /*  console.error("sendData: respuesta no OK", resp.status, body); */
      return { ok: false, status: resp.status, body };
    }

    return { ok: true, status: resp.status, body };
  } catch (err: unknown) {
    if ((err as { name: string }).name === "AbortError") {
      console.error("sendData: timeout de la solicitud");
    } else {
      console.error("sendData: error fetch", err);
    }
    return { ok: false };
  }
};
