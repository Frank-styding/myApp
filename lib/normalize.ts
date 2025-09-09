import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const baseWidth = 385;

export function scaleFont(size: number) {
  return size * (SCREEN_WIDTH / baseWidth);
}

export function normalize(size: number): number {
  const newSize = scaleFont(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
