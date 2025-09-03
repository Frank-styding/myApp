import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export function useAnimatedLogo(widthInitial: number, heightInitial: number) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const screenWidthSV = useSharedValue(screenWidth);
  const screenHeightSV = useSharedValue(screenHeight);
  const width = useSharedValue(widthInitial);
  const height = useSharedValue(heightInitial);
  const opacity = useSharedValue(0);
  const opacity1 = useSharedValue(1);
  const opacityView = useSharedValue(0);
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  useEffect(() => {
    screenWidthSV.value = screenWidth;
    screenHeightSV.value = screenHeight;
  }, [screenWidth, screenHeight, screenWidthSV, screenHeightSV]);

  // Calculamos el centro dentro del worklet
  const animatedLogoStyle = useAnimatedStyle(() => {
    const centerX = screenWidthSV.value / 2 - width.value / 2;
    const centerY = screenHeightSV.value / 2 - height.value / 2;

    return {
      position: "absolute",
      width: width.value,
      height: height.value,
      left: centerX + x.value,
      top: centerY + y.value,
    };
  });

  const animatedLogoTitleStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: screenWidth / 2 - width.value / 2 + 10,
    top: screenHeight / 2 - height.value / 2,
    opacity: opacity.value,
  }));

  const animatedViewStyle = useAnimatedStyle(() => ({
    opacity: opacityView.value,
  }));

  const animatedLogo2Style = useAnimatedStyle(() => ({
    opacity: opacity1.value,
  }));

  const runStep = useCallback(
    (index: number) => {
      if (index === 0) {
        // Paso 1: Mover a la izquierda y mostrar título
        x.value = withDelay(500, withTiming(-80, { duration: 200 }));
        opacity.value = withDelay(500, withTiming(1, { duration: 200 }));

        // Siguiente step después de 1300ms (500ms delay + 800ms)
        setTimeout(() => runStep(1), 1300);
      } else if (index === 1) {
        // Paso 2: Volver al centro, ocultar título y agrandar
        x.value = withDelay(500, withTiming(0, { duration: 500 }));
        opacity.value = withDelay(500, withTiming(0, { duration: 200 }));
        width.value = withDelay(
          500,
          withTiming(widthInitial * 1.3, { duration: 500 })
        );
        height.value = withDelay(
          500,
          withTiming(heightInitial * 1.3, { duration: 500 })
        );

        // Siguiente step después de 1300ms (500ms delay + 800ms)
        setTimeout(() => runStep(2), 1300);
        activeRef.current = true;
      } else if (index === 2) {
        opacity1.value = withDelay(500, withTiming(0, { duration: 300 }));
        // Paso 3: Mover arriba, reducir tamaño y mostrar contenido
        y.value = withDelay(
          500,
          withTiming(-(screenHeightSV.value / 2 - (heightInitial * 1.3) / 2), {
            duration: 300,
          })
        );
        width.value = withDelay(
          500,
          withTiming(widthInitial * 0.8, { duration: 300 })
        );
        height.value = withDelay(
          500,
          withTiming(heightInitial * 0.8, { duration: 300 })
        );

        opacityView.value = withDelay(500, withTiming(1, { duration: 300 }));

        // Activar después de la animación
        setTimeout(() => {
          setActive(true);
        }, 800);
      }
    },
    [widthInitial, heightInitial, screenHeightSV]
  );

  useEffect(() => {
    runStep(0);
  }, [runStep]);

  return {
    animatedLogoStyle,
    animatedLogoTitleStyle,
    animatedViewStyle,
    activeRef,
    animatedLogo2Style,
    active,
  };
}
