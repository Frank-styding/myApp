import { getFormattedDate } from "@/utils/getFormattedDate";
import NetInfo from "@react-native-community/netinfo";
import Constants from "expo-constants";

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
  data: { time: string; state: string; id?: string; timeNumber?: number }[];
}): Promise<{ ok: boolean; status?: number; body?: any }> => {
  const apiUrl = Constants.expoConfig?.extra?.API_URL;
  console.log(apiUrl);

  if (!apiUrl) {
    console.warn("sendData: apiUrl no configurada");
    return { ok: false };
  }

  const netState = await NetInfo.fetch();
  if (!netState.isConnected || !netState.isInternetReachable) {
    console.warn("sendData: Sin conexión a internet");
    return { ok: false };
  }

  const waitUntilReady = async (
    maxRetries = 3,
    interval = 500
  ): Promise<boolean> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const resp = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "isReady" }),
        });

        const json = await resp.json();
        if (json.isReady) {
          return true;
        }
      } catch (err) {
        console.warn("sendData: error consultando isReady", err);
      }
      await new Promise((res) => setTimeout(res, interval));
    }
    return false;
  };

  /*  const existsRequest = async (id: string) => {
    if (await hasProcessedId(id)) return true;
    const existsResp = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "existsRequest", data: { requestId: id } }),
    });

    const { exists } = await existsResp.json();
    if (exists) {
      await addProcessedId(id);
    }
    return exists;
  }; */

  try {
    // 1. Esperar hasta que esté listo
    console.log("check if is ready");
    const ready = await waitUntilReady();
    if (!ready) {
      console.error("sendData: API no está lista después de varios intentos");
      return { ok: false };
    }

    // 2. Si hay id, validar que no exista antes de enviar
    /*    if (id) {
      try {
        console.log("check if exist");
        const exists = await existsRequest(id);
        if (exists) {
          console.warn("sendData: request con id ya existe, no se enviará");
          const deleteRequestResp = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "deleteRequest", requestId: id }),
          });
          if (deleteRequestResp.ok) {
            removeProcessedId(id);
            console.warn("sendData: request elimnado del servidor");
            return { ok: true };
          }
          return { ok: false };
        }
      } catch (err) {
        console.error("sendData: error validando existsRequest", err);
        return { ok: false };
      }
    } */

    // 3. Enviar datos si pasó validación
    console.log("sending data");

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        type: "insert:format_1",
        timestamp: Math.floor(Date.now() / 1000),
        id,
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
              _time: item.timeNumber,
            })),
          },
        },
      }),
    });

    const body = await resp.text().catch(() => null);

    if (!resp.ok) {
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
