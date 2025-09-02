import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const ZUSTAND_KEY = "user-storage";

export interface IConfig {
  buttons: { label: string; value: string }[];
  select_options: { label: string; value: string }[];
  messages: Record<string, { title: string; message: string }>;
}
interface AppState {
  data: { place?: string; name?: string; dni?: string; password?: string };
  config: IConfig;
  image?: string;
  setData: (
    data: { place?: string; name?: string; dni?: string; password?: string },
    callback?: () => void
  ) => void;
  setConfig: (config: IConfig) => void;
  setImage: (image: string) => void;
}

export const useAppState = create<AppState>()(
  persist<AppState>(
    (set, get) => ({
      data: {},
      config: {
        buttons: [
          { label: "Almuerzo", value: "almuerzo" },
          { label: "Falta de materiales", value: "materiales" },
          { label: "Traslados internos", value: "traslado interno" },
          { label: "Causas climatológicas", value: "problemas climaticos" },
          { label: "Charlas & Reuniones", value: "charla" },
          { label: "Pausas Activas", value: "pausa activa" },
          { label: "Repaso", value: "repaso" },
        ],

        select_options: [
          { label: "N°1", value: "1" },
          { label: "N°2", value: "2" },
          { label: "N°3", value: "3" },
          { label: "N°4", value: "4" },
          { label: "N°5", value: "5" },
        ],
        messages: {
          almuerzo: {
            title: "¡Disfruta del almuerzo, Capitán!",
            message: `Recargar energías es la mejor inversión
para una tarde productiva.
¡Te esperamos!`,
          },
          materiales: {
            title: "¡Material en camino, Capitán!",
            message: `En unos minutos tu equipo volverá
a la acción con todo lo necesario.`,
          },
          charla: {
            title: "¡Un momento de estrategia, Capitán!",
            message: `Tu equipo está planificando los siguientes pasos. La comunicación es la base del éxito.`,
          },
          repaso: {
            title: "¡Capitán, un momento de reflexión!",
            message: `El equipo está revisando los detalles. Analizar el día es clave para mejorar mañana.`,
          },
          "traslado interno": {
            title: "¡En movimiento, Capitán!",
            message: `El equipo se está trasladando. 
¡La productividad no se detiene!`,
          },
          "problemas climaticos": {
            title: "¡Una breve pausa, Capitán!",
            message: `El clima manda en el campo, 
pero el equipo está listo para continuar 
en cuanto el cielo lo permita.`,
          },
          "pausa activa": {
            title: `Recuerda, Capitán: 
¡Cuerpo sano, mente sana!`,
            message: `El equipo está en su pausa activa. Unos minutos 
de estiramiento y a seguir con la jornada.`,
          },
        },
      },
      setData: (data, callback) => {
        set(() => ({ data }));
        setTimeout(() => {
          callback?.();
        }, 100);
      },
      setConfig: (config) => {
        set(() => ({ config }));
      },
      setImage: (image) => {
        set(() => ({ image }));
      },
    }),
    {
      name: ZUSTAND_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
