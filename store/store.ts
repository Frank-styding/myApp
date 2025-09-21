import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Key for storing data in AsyncStorage
const ZUSTAND_KEY = "user-storage";

// Interface for user data structure
export interface IUserData {
  place?: string;
  name?: string;
  dni?: string;
  password?: string;
}

// Interface for application configuration
export interface IConfig {
  buttons: { label: string; value: string }[];
  select_options: { label: string; value: string }[];
  messages: Record<string, { title: string; message: string }>;
}

// Main application state interface
interface AppState {
  data: IUserData;
  config: IConfig;
  image?: string;
  imageHash?: string;

  /*   lastConfigUpdate?: number; // Timestamp of last configuration update */
  hasLoadedConfig: false;

  isWorking: boolean;
  endReason: null | string;
  endModalState: number;

  hasSession: boolean;
  sessionStart?: number;
  sessionDuration: number;

  // State update methods
  setData: (data: IUserData, callback?: () => void) => void;
  setConfig: (config: IConfig) => void;
  setImage: (image: string) => void;
  setImageHash: (image: string) => void;
  startSession: (durationMs: number) => void;
  endSession: () => void;
  checkSession: () => boolean;
  setIsWorking: (value: boolean) => void;
  setEndModalState: (value: number) => void;
  setEndReason: (value: string | null) => void;
}

// Default configuration values
const defaultConfig: IConfig = {
  buttons: [
    { label: "Almuerzo", value: "almuerzo" },
    { label: "Falta de materiales", value: "materiales" },
    { label: "Traslados internos", value: "traslado interno" },
    { label: "Causas climatológicas", value: "problemas climaticos" },
    { label: "Charlas & Reuniones", value: "charla" },
    { label: "Pausas Activas", value: "pausa activa" },
    { label: "Cambio de formato", value: "Cambio de formato" },
  ],

  select_options: [
    { label: "Santo Domingo", value: "Santo_Domingo" },
    { label: "Agromorin", value: "Agromorin" },
    { label: "Casaverde", value: "Casaverde" },
    { label: "Compositan", value: "Compositan" },
    { label: "Victoria", value: "Victoria" },
    { label: "El Palmar", value: "El_Palmar" },
  ],
  messages: {
    almuerzo: {
      title: "¡Disfruta del almuerzo, Capitán!",
      message: `Recargar energías es la mejor inversión para una tarde productiva. ¡Te esperamos!`,
    },
    materiales: {
      title: "¡Material en camino, Capitán!",
      message: `En unos minutos tu equipo volverá a la acción con todo lo necesario.`,
    },
    charla: {
      title: "¡Un momento de estrategia, Capitán!",
      message: `Tu equipo está planificando los siguientes pasos. La comunicación es la base del éxito.`,
    },
    "Cambio de formato": {
      title: "¡Cambio de formato, Capitán!",
      message: `El equipo está ajustándose para cosechar el nuevo producto. ¡La versatilidad es nuestra fortaleza!`,
    },
    "traslado interno": {
      title: "¡En movimiento, Capitán!",
      message: `El equipo se está trasladando. ¡La productividad no se detiene!`,
    },
    "problemas climaticos": {
      title: "¡Una breve pausa, Capitán!",
      message: `El clima manda en el campo, pero el equipo está listo para continuar en cuanto el cielo lo permita.`,
    },
    "pausa activa": {
      title: `Recuerda, Capitán: ¡Cuerpo sano, mente sana!`,
      message: `El equipo está en su pausa activa. Unos minutos de estiramiento y a seguir con la jornada.`,
    },
  },
};

// Create Zustand store with persistence
export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state values
      data: {},
      config: defaultConfig,
      hasSession: false,
      isWorking: false,
      sessionStart: undefined,
      sessionDuration: 0,
      hasLoadedConfig: false,
      endModalState: 0,
      endReason: null as null | string,

      setEndReason: (value) => {
        set(() => ({ endReason: value }));
      },
      setEndModalState: (value) => {
        set(() => ({ endModalState: value }));
      },

      // Update working status
      setIsWorking: (value) => {
        set(() => ({ isWorking: value }));
      },

      // Update user data with optional callback
      setData: (data, callback) => {
        set({ data });
        callback?.();
      },

      // Update configuration
      setConfig: (config) => set({ config }),

      // Update user image
      setImage: (image) => set({ image }),

      // Update image hash
      setImageHash: (imageHash) => set({ imageHash }),

      // Start a new session with specified duration
      startSession: (durationMs) => {
        set({
          hasSession: true,
          sessionStart: Date.now(),
          sessionDuration: durationMs,
        });
      },

      // End current session and clear user data
      endSession: () => {
        set({
          hasSession: false,
          sessionStart: undefined,
          sessionDuration: 0,
          data: {},
        });
      },

      // Check if session is still valid
      checkSession: () => {
        const { sessionStart, sessionDuration } = get();
        if (!sessionStart) return false;
        const now = Date.now();
        const expired = now - sessionStart > sessionDuration;
        if (expired) {
          set({
            hasSession: false,
            sessionStart: undefined,
            sessionDuration: 0,
          });
          return false;
        }
        return true;
      },
    }),
    {
      // Persistence configuration
      name: ZUSTAND_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
