import { generateUUID } from "@/utils/generateUUID";
import { getCurrentTime } from "@/utils/getCurrentTime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const QUEUE_KEY = "sync_queue";
const ZUSTAND_KEY = "user-storage";

export interface QueueItem {
  dni: string;
  name: string;
  place: string;
  state: string;
  id: string;
  time: string;
  attempts?: number; // Nuevo campo para contar intentos
  lastAttempt?: string; // Nuevo campo para último intento
}

interface AppState {
  data: { value?: string; name?: string; dni?: string };
  requests: QueueItem[];
  setValue: (
    data: { value?: string; name?: string; dni?: string },
    callback?: () => void
  ) => void;
  addRequest: (
    data: {
      dni: string;
      name: string;
      place: string;
      state: string;
      id: string;
      time: string;
      timeNumber: number;
    },
    callback?: () => void
  ) => Promise<void>;
  clearRequests: () => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  // Nuevas funciones para manejar el estado de envío
  markAsSent: (id: string) => Promise<void>;
  incrementAttempt: (id: string) => Promise<void>;
  // Función para obtener requests pendientes (para el background task)
  getPendingRequests: () => Promise<QueueItem[]>;
}

/** helpers queue */
async function readQueue(): Promise<QueueItem[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Error reading queue:", error);
    return [];
  }
}

async function writeQueue(queue: QueueItem[]) {
  try {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error("Error writing queue:", error);
  }
}

export const useAppState = create<AppState>()(
  persist<AppState>(
    (set, get) => ({
      data: {},
      requests: [],
      setValue: (data, callback) => {
        set(() => ({ data }));
        setTimeout(() => {
          callback?.();
        }, 100);
      },
      addRequest: async (request, callback) => {
        const newItem: QueueItem = {
          ...request,

          attempts: 0,
          lastAttempt: undefined,
        };

        // 1) actualizar store (in-memory + persist)
        set((state) => ({ requests: [...state.requests, newItem] }));

        // 2) actualizar cola persistente (fuente de verdad para background)
        const queue = await readQueue();
        queue.push(newItem);
        await writeQueue(queue);

        // small delay to let zustand persist; callback optional
        setTimeout(() => {
          callback?.();
        }, 100);
      },
      clearRequests: async () => {
        // limpiar tanto store como cola
        set(() => ({ requests: [] }));
        await writeQueue([]);
      },
      deleteRequest: async (id: string) => {
        // eliminar de store
        set((state) => ({
          requests: state.requests.filter((r) => r.id !== id),
        }));

        // eliminar de cola persistente
        const queue = await readQueue();
        const newQueue = queue.filter((r) => r.id !== id);
        await writeQueue(newQueue);
      },
      // Nueva función para marcar un request como enviado
      markAsSent: async (id: string) => {
        // Eliminar de store
        set((state) => ({
          requests: state.requests.filter((r) => r.id !== id),
        }));

        // Eliminar de cola persistente
        const queue = await readQueue();
        const newQueue = queue.filter((r) => r.id !== id);
        await writeQueue(newQueue);
      },
      // Nueva función para incrementar intentos
      incrementAttempt: async (id: string) => {
        const currentTime = getCurrentTime();

        // Actualizar en store
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  attempts: (r.attempts || 0) + 1,
                  lastAttempt: currentTime,
                }
              : r
          ),
        }));

        // Actualizar en cola persistente
        const queue = await readQueue();
        const updatedQueue = queue.map((r) =>
          r.id === id
            ? {
                ...r,
                attempts: (r.attempts || 0) + 1,
                lastAttempt: currentTime,
              }
            : r
        );
        await writeQueue(updatedQueue);
      },
      // Nueva función para obtener requests pendientes
      getPendingRequests: async () => {
        const queue = await readQueue();
        // Filtrar requests con menos de 5 intentos (para no intentar indefinidamente)
        return queue.filter((item) => (item.attempts || 0) < 5);
      },
    }),
    {
      name: ZUSTAND_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
