import Constants from "expo-constants";
export const loginUser = async ({
  dni,
  password,
}: {
  dni: string;
  password: string;
}) => {
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
      type: "login",
      timestamp: Math.floor(Date.now() / 1000),
      data: {
        dni,
        password,
      },
    }),
  });

  const json = await resp.json();

  if (resp.ok) {
    return {
      ok: true,
      correct: json.correct,
    };
  }

  return { ok: false };
};
