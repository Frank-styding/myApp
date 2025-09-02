import { useEffect, useCallback, useState } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import BackgroundService from "react-native-background-actions";
import { backgroundSendTask } from "@/services/backgroundService/backgroundService";
import { BackgroundState } from "@/lib/backgroundState";

export const useBackgroundSync = () => {
  const [isRunning, setIsRunning] = useState(false);
  const checkPermissions = useCallback(async () => {
    let granted = true;
    if (Platform.OS === "android") {
      if (Platform.Version >= 33) {
        const notificationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        granted = notificationGranted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return granted;
  }, []);

  const startBackgroundTask = useCallback(async () => {
    if (await BackgroundService.isRunning()) return;

    const options = {
      taskName: "DataSyncTask",
      taskTitle: "Sincronizando datos",
      taskDesc: "Enviando datos pendientes...",
      taskIcon: { name: "ic_launcher", type: "mipmap" },
      color: "#00ff00",
      parameters: { delay: 30000 },
      linkingURI: "yourapp://deeplink",
      ...(Platform.OS === "android" && {
        notificationId: 123,
        notificationChannel: "BackgroundSync",
        actions: "Detener",
      }),
    };

    try {
      await BackgroundService.start(backgroundSendTask, options);
      setIsRunning(true);
    } catch (e) {
      console.error("Error iniciando servicio:", e);
    }
  }, []);

  const stopBackgroundTask = useCallback(async () => {
    try {
      await BackgroundService.stop();
      setIsRunning(false);
    } catch (e) {
      console.error("Error deteniendo servicio:", e);
    }
  }, []);

  // Verificar estado del servicio
  useEffect(() => {
    const checkService = async () => {
      const running = await BackgroundService.isRunning();
      setIsRunning(running);
    };

    checkService();
    const interval = setInterval(checkService, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    isRunning,
    startBackgroundTask,
    stopBackgroundTask,
    checkPermissions,
    addRequest: BackgroundState.addRequest,
    getRequests: BackgroundState.getRequests,
  };
};
