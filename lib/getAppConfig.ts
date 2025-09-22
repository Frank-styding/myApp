import { IConfig } from "@/store/store";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";
export const getAppConfig = async () => {
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

  const resp = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      type: "appConfig",
      timestamp: Date.now(),
    }),
  });
  //console.log(resp);

  const json = await resp.json();

  if (resp.ok) {
    return { ok: false, config: json.config as IConfig };
  }

  return { ok: false, config: json.config as IConfig };
};
