import { sendData } from "@/lib/SendData";
import { QueueItem, useAppState } from "@/store/store";
import BackgroundService from "react-native-background-actions";

export const backgroundSendTask = async (taskData?: any) => {
  const { delay = 10000 } = taskData || {}; // 10 segundos por defecto

  while (await BackgroundService.isRunning()) {
    try {
      // Obtener el estado actual de las solicitudes
      const { requests } = useAppState.getState();

      // Si no hay datos pendientes, detener la tarea
      if (requests.length === 0) {
        console.log(
          "No hay datos pendientes. Deteniendo tarea en segundo plano."
        );
        await BackgroundService.stop();
        break; // Salir del bucle
      }

      // Procesar solicitudes pendientes
      await processPendingRequests();

      console.log(
        `Tarea ejecutada. Esperando ${delay}ms para la próxima ejecución`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      console.error("Error en background task:", error);
      // Pequeña pausa antes de reintentar incluso en caso de error
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Mapa para mantener el conteo de reintentos por lote
const batchRetryCount = new Map<string, number>();

const processPendingRequests = async () => {
  const { requests, deleteRequest } = useAppState.getState();
  if (requests.length === 0) return;

  console.log(`Procesando ${requests.length} requests pendientes...`);

  // Agrupar requests por lugar y DNI
  const groupedRequests: Record<string, Record<string, QueueItem[]>> = {};

  requests.forEach((item) => {
    if (!groupedRequests[item.place]) groupedRequests[item.place] = {};
    if (!groupedRequests[item.place][item.dni])
      groupedRequests[item.place][item.dni] = [];
    groupedRequests[item.place][item.dni].push(item);
  });

  // Procesar cada grupo
  for (const place in groupedRequests) {
    for (const dni in groupedRequests[place]) {
      const batch = groupedRequests[place][dni];
      const batchId = `${place}-${dni}`;

      // Saltar si excedió el máximo de reintentos (3)
      if ((batchRetryCount.get(batchId) || 0) >= 3) continue;

      try {
        const { name } = batch[0];
        const result = await sendData({
          dni,
          place,
          name,
          data: batch.map((item) => ({
            time: item.time,
            state: item.state,
          })),
        });

        if (result.ok) {
          // Eliminar requests exitosos
          batch.forEach((item) => deleteRequest(item.id));
          batchRetryCount.delete(batchId);
          console.log(`Batch ${batchId} enviado exitosamente`);
        } else {
          // Incrementar contador de reintentos
          const currentCount = batchRetryCount.get(batchId) || 0;
          batchRetryCount.set(batchId, currentCount + 1);
          console.log(
            `Error en batch ${batchId}. Reintentos: ${currentCount + 1}`
          );
        }
      } catch (error) {
        const currentCount = batchRetryCount.get(batchId) || 0;
        batchRetryCount.set(batchId, currentCount + 1);
        console.error(`Error en batch ${batchId}:`, error);
      }

      // Pequeña pausa entre batches
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};
