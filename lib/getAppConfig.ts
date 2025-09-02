import { IConfig } from "@/store/store";
import Constants from "expo-constants";
export const getAppConfig = async () => {
  const apiUrl = Constants.expoConfig?.extra?.API_URL;

  if (!apiUrl) {
    console.warn("sendData: apiUrl no configurada");
    return { ok: false };
  }

  const resp = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      type: "appConfig",
      timestamp: Math.floor(Date.now() / 1000),
    }),
  });

  const json = await resp.json();

  if (resp.ok) {
    return { ok: false, config: json.config as IConfig };
  }

  return { ok: false, config: json.config as IConfig };
};
