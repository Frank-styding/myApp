import { useState } from "react";

export function usePost<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postData = async (url: string, body: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = (await response.json()) as T;
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
}
