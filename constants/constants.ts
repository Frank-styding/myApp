export const fontsMap = {
  "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
  "Lato-Light": require("../assets/fonts/Lato-Light.ttf"),
  "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
};

export const Fonts = {
  "Lato-Bold": "Lato-Bold",
  "Lato-Light": "Lato-Light",
  "Poppins-Bold": "Poppins-Bold",
  "Poppins-Light": "Poppins-Light",
};

export const Colors = {
  primary: "#D5FF5F",
  background: "#2D2D35",
  black: "#000000",
  light0: "#ffffff",
  light1: "#CECECE",
  light3: "#BABABA",
  black1: "#464646",
  black2: "#656565",
};

export const STATES = {
  trabajando: "trabajando",
  "fin jornada": "fin jornada",
};

export const button_options = [
  { label: "Almuerzo", value: "almuerzo" },
  { label: "Falta de materiales", value: "materiales" },
  { label: "Traslados internos", value: "traslado interno" },
  { label: "Causas Climatólogicas", value: "problemas climaticos" },
  { label: "Charlas & Reuniones", value: "charla" },
  { label: "Pausas Activas", value: "pausa" }, //! change to "pausa activa"
  { label: "Falta de Materia prima", value: "materia prima" },
  { label: "Repaso", value: "repaso" },
];
export const select_options = [
  { label: "N°1", value: "1" },
  { label: "N°2", value: "2" },
  { label: "N°3", value: "3" },
  { label: "N°4", value: "4" },
  { label: "N°5", value: "5" },
];

export const Messages: Record<string, { message: string; title: string }> = {
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
  pausa: {
    title: `Recuerda, Capitán: 
¡Cuerpo sano, mente sana!`,
    message: `El equipo está en su pausa activa. Unos minutos 
de estiramiento y a seguir con la jornada.`,
  }, //! change to "pausa activa"
  "materia prima": {
    title: `Materia prima?`,
    message: ``,
  },
};
