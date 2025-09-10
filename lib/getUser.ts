import Constants from "expo-constants";
export const getUser = async ({ dni }: { dni: string }) => {
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
      type: "getUser",
      timestamp: Date.now(),
      data: {
        dni,
      },
    }),
  });

  const json = await resp.json();

  if (resp.ok) {
    return { ok: false, name: json.name };
  }

  return { ok: false };
};
