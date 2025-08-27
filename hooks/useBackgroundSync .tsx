import { useAppState } from "@/store/store";
import NetInfo from "@react-native-community/netinfo";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  AppStateStatus,
  PermissionsAndroid,
  Platform,
} from "react-native";
import BackgroundService from "react-native-background-actions";

interface BackgroundTaskOptions {
  taskName?: string;
  taskTitle?: string;
  taskDesc?: string;
  delay?: number;
}

export const useBackgroundSync = (
  backgroundSendTask: (taskData?: any) => Promise<void>,
  options: BackgroundTaskOptions = {}
) => {
  // Valores por defecto para las opciones
  const {
    taskName = "EnviarDatosBackground",
    taskTitle = "Enviando datos...",
    taskDesc = "Enviando datos pendientes en segundo plano",
    delay = 5000,
  } = options;

  const { requests } = useAppState();

  const [isOnline, setIsOnline] = useState(false);
  const [isBackgroundTaskRunning, setIsBackgroundTaskRunning] = useState(false);
  const [hasPendingData, setHasPendingData] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );
  const [hasPermissions, setHasPermissions] = useState<boolean>(
    Platform.OS === "ios"
  );
  const taskRunningRef = useRef(false);
  const wasOfflineRef = useRef(!isOnline); // Referencia para rastrear cambios de conectividad

  // Verificar y solicitar permisos al montar el componente
  useEffect(() => {
    checkPermissions();
  }, []);

  // Verificar datos pendientes cuando cambia la cola
  useEffect(() => {
    const pending = requests.some((item) => (item.attempts || 0) < 5);
    setHasPendingData(pending);
  }, [requests]);

  const startBackgroundTask = useCallback(async () => {
    if (taskRunningRef.current) return;

    console.log("Iniciando tarea en segundo plano");

    try {
      const taskOptions = {
        taskName,
        taskTitle,
        taskDesc,
        taskIcon: {
          name: "ic_launcher",
          type: "mipmap",
        },
        color: "#ff00ff",
        parameters: {
          delay,
        },
        // Añade esta configuración para ejecución periódica
        linkingURI: "yourappscheme://background", // Esquema de tu app
        // Opcional: configuración para Android
        ...(Platform.OS === "android" && {
          // Importante para Android 8+
          notificationId: 1234,
          notificationChannel: "BackgroundTaskChannel",
        }),
      };

      await BackgroundService.start(backgroundSendTask, taskOptions);
      taskRunningRef.current = true;
      setIsBackgroundTaskRunning(true);
      console.log("Servicio en segundo plano iniciado");
    } catch (error) {
      console.error("Error iniciando servicio en segundo plano:", error);
    }
  }, [backgroundSendTask, taskName, taskTitle, taskDesc, delay]);
  // Configurar listener de conectividad
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const onlineStatus = state.isConnected && state.isInternetReachable;
      const wasOffline = wasOfflineRef.current;

      // Actualizar el estado de conexión
      setIsOnline(onlineStatus || false);

      // Si la aplicación está en segundo plano, hay datos pendientes, permisos,
      // y la conexión cambió de offline a online, iniciar la tarea
      if (
        appState === "background" &&
        hasPendingData &&
        hasPermissions &&
        onlineStatus &&
        wasOffline &&
        !taskRunningRef.current
      ) {
        startBackgroundTask();
      }

      // Actualizar la referencia para el próximo cambio
      wasOfflineRef.current = !onlineStatus;
    });

    return unsubscribe;
  }, [appState, hasPendingData, hasPermissions, startBackgroundTask]);

  // Verificar y solicitar permisos
  const checkPermissions = useCallback(async () => {
    if (Platform.OS === "android") {
      try {
        // Verificar y solicitar permiso para notificaciones (necesario para Android 13+)
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          setHasPermissions(granted === PermissionsAndroid.RESULTS.GRANTED);
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }

        // Para versiones anteriores de Android, asumimos que tenemos permisos
        setHasPermissions(true);
        return true;
      } catch (err) {
        console.error("Error verificando permisos:", err);
        setHasPermissions(false);
        return false;
      }
    }

    // iOS maneja los permisos de forma diferente, generalmente a través de prompts del sistema
    setHasPermissions(true);
    return true;
  }, []);

  const stopBackgroundTask = useCallback(async () => {
    try {
      await BackgroundService.stop();
      taskRunningRef.current = false;
      setIsBackgroundTaskRunning(false);
      console.log("Servicio en segundo plano detenido");
    } catch (error) {
      console.error("Error deteniendo servicio:", error);
    }
  }, []);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      // Si la aplicación pasa a segundo plano y hay datos pendientes, conexión y permisos
      if (
        nextAppState === "background" &&
        hasPendingData &&
        isOnline &&
        hasPermissions &&
        !taskRunningRef.current
      ) {
        startBackgroundTask();
      }
      // Si la aplicación vuelve a primer plano, detener la tarea
      else if (nextAppState === "active" && taskRunningRef.current) {
        stopBackgroundTask();
      }

      setAppState(nextAppState);
    },
    [
      hasPendingData,
      isOnline,
      hasPermissions,
      startBackgroundTask,
      stopBackgroundTask,
    ]
  );

  // Escuchar cambios en el estado de la aplicación
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => {
      if (taskRunningRef.current) {
        stopBackgroundTask();
      }
    };
  }, [stopBackgroundTask]);

  return {
    isOnline,
    hasPendingData,
    isBackgroundTaskRunning,
    appState,
    hasPermissions,
    checkPermissions,
    startBackgroundTask,
    stopBackgroundTask,
  };
};
