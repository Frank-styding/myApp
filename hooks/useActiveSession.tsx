import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useActiveSession(initialDays = 0) {
  const [isActive, setIsActive] = useState(false);
  const [endDate, setEndDate] = useState<Date>(new Date());

  // 🔄 Restaurar sesión guardada
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedEndDate = await AsyncStorage.getItem("sessionEndDate");

        if (savedEndDate) {
          const end = new Date(savedEndDate);
          const stillValid = new Date() <= end;

          setIsActive(stillValid);
          setEndDate(end);
        }
      } catch (error) {
        console.error("Error restoring session:", error);
      }
    };

    restoreSession();
  }, []);

  // 🔄 Función para reactivar la sesión X días
  const reactivateSession = useCallback(async (days: number) => {
    try {
      const now = new Date();
      const newEndDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      setIsActive(true);
      setEndDate(newEndDate);

      await AsyncStorage.setItem("sessionActive", JSON.stringify(true));
      await AsyncStorage.setItem("sessionEndDate", newEndDate.toISOString());
    } catch (error) {
      console.error("Error reactivating session:", error);
    }
  }, []);

  useEffect(() => {
    if (!endDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      if (now > endDate) {
        setIsActive(false);
        AsyncStorage.setItem("sessionActive", JSON.stringify(false));
      }
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, [endDate]);

  return { isActive, endDate, reactivateSession };
}
