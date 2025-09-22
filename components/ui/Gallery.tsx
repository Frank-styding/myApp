import { useState, useRef, useEffect } from "react";
import { SafeAreaView, View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  cancelAnimation,
  withTiming,
  runOnJS,
  useAnimatedStyle,
} from "react-native-reanimated";
import tw from "twrnc";
export const Gallery = ({
  pages,
  active,
}: {
  pages: React.ReactNode[];
  active: boolean;
}) => {
  const [page, setPage] = useState(0);
  const opacity = useSharedValue(1);
  const intervalRef = useRef<number | null>(null);
  const isActiveRef = useRef(active);
  const animationTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    isActiveRef.current = active;
  }, [active]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
      cancelAnimation(opacity);
    };
  }, []);

  useEffect(() => {
    if (!active) {
      // Limpiar el intervalo si no está activo
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const changePage = (finished?: boolean) => {
      if (!finished || !isActiveRef.current) return;

      setPage((prev) => {
        const next = prev + 1;
        if (next >= pages.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return pages.length - 1;
        }
        return next;
      });

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationTimeoutRef.current = setTimeout(() => {
        if (isActiveRef.current) {
          opacity.value = withTiming(1, { duration: 300 });
        }
      }, 100) as unknown as number;
    };

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (page >= pages.length - 1) {
        setPage(pages.length - 1);
        return;
      }
      opacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (!finished) return;
        runOnJS(changePage)(finished);
      });
    }, 2000) as unknown as number;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, pages.length, page]); // Añadir page como dependencia

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Función para cambiar de página al presionar la pantalla
  const handlePress = () => {
    setPage((prev) => {
      const next = prev + 1;
      return next >= pages.length ? prev : next;
    });
    opacity.value = withTiming(1, { duration: 300 });
  };

  return (
    <Animated.View style={tw`flex-1 gap-6`}>
      <Pressable style={{ flex: 9 }} onPress={handlePress}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          {pages[page]}
        </Animated.View>
      </Pressable>

      <Animated.View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
        }}
      >
        {pages.map((_, i) => (
          <View
            key={`page_${i}`}
            style={{
              width: 54,
              height: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ccc",
              backgroundColor: page === i ? "#000" : "#ccc",
              marginHorizontal: 2,
            }}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
};
