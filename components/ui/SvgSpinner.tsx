import React, { useRef, useEffect } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

export const SvgSpinner = ({ size = 40, color = "#3498db" }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();

    return () => spin.stop();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Svg height={size} width={size} viewBox="0 0 50 50">
          <Circle
            cx="25"
            cy="25"
            r="20"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="90"
            strokeDashoffset="60"
            fill="none"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};
