// ==================== FONTS ====================
export const fontsMap = {
  "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
  "Lato-Light": require("../assets/fonts/Lato-Light.ttf"),
  "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
  "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
};

export const Fonts: Record<keyof typeof fontsMap, string> = {
  "Lato-Bold": "Lato-Bold",
  "Lato-Light": "Lato-Light",
  "Lato-Regular": "Lato-Regular",
  "Poppins-Bold": "Poppins-Bold",
  "Poppins-Light": "Poppins-Light",
};

// ==================== COLORS ====================
export const Colors = {
  primary: "#D5FF5F",
  background: "#2D2D35",
  black: "#000000",
  light0: "#FFFFFF",
  light1: "#CECECE",
  light3: "#BABABA",
  black1: "#464646",
  black2: "#656565",
};

// ==================== STATES ====================
export const STATES = {
  trabajando: "trabajando",
  finJornada: "fin jornada",
  noTrabajando: "no trabajando",
  transladoFundo: "translado de fundo",
  horasExtra: "horas extra",
};
export const RESET_TIME_CONFIG = 7 * 24 * 60 * 60 * 1000;
