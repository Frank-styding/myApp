import { useCallback, useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export function useAnimatedLogo(widthIniital: number, heightInitial: number) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const width = useSharedValue(widthIniital);
  const height = useSharedValue(heightInitial);
  const opacity = useSharedValue(0);
  const opacityView = useSharedValue(0);
  const [active, setActive] = useState(false);
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  // Calculamos el centro dentro del worklet
  const animatedLogoStyle = useAnimatedStyle(() => {
    const centerX = screenWidth / 2 - width.value / 2;
    const centerY = screenHeight / 2 - height.value / 2;

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

  const runStep = useCallback((index: number) => {
    "worklet";

    if (index === 0) {
      x.value = withDelay(500, withTiming(-80, { duration: 500 }));
      opacity.value = withDelay(500, withTiming(1, { duration: 200 }));
      // siguiente step
      setTimeout(() => runStep(1), 500 + 800);
    } else if (index === 1) {
      x.value = withDelay(500, withTiming(0, { duration: 500 }));
      opacity.value = withDelay(500, withTiming(0, { duration: 200 }));
      width.value = withDelay(
        500,
        withTiming(widthIniital * 1.3, { duration: 500 })
      );
      height.value = withDelay(
        500,
        withTiming(heightInitial * 1.3, { duration: 500 })
      );
      setTimeout(() => runStep(2), 500 + 800);
    } else if (index === 2) {
      y.value = withDelay(
        500,
        withTiming(-(screenHeight / 2 - height.get() / 2), {
          duration: 300,
        })
      );
      width.value = withDelay(
        500,
        withTiming(widthIniital * 0.8, { duration: 300 })
      );
      height.value = withDelay(
        500,
        withTiming(heightInitial * 0.8, { duration: 300 })
      );
      opacityView.value = withDelay(500, withTiming(1, { duration: 300 }));
      setActive(true);
    }
  }, []);

  useEffect(() => {
    runStep(0);
  }, [runStep]);

  return {
    animatedLogoStyle,
    animatedLogoTitleStyle,
    animatedViewStyle,
    active,
  };
}
