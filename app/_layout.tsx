import { Colors, fontsMap } from "@/constants/constants";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Image, SafeAreaView } from "react-native";
import NetInfo, { NetInfoSubscription } from "@react-native-community/netinfo";
import tw from "twrnc";
import { useBackgroundSync } from "@/hooks/useBackgroundSync";
import { ModalProvider } from "@/hooks/ModalProvider";

export default function Layout() {
  const [fontsLoaded] = useFonts(fontsMap);
  const { isRunning, startBackgroundTask } = useBackgroundSync();
  const wasConnected = useRef<boolean | null>(null);

  useEffect(() => {
    let unsubscribe: NetInfoSubscription;

    unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected === true;

      if (isOnline && wasConnected.current === false && !isRunning) {
        startBackgroundTask();
      }

      wasConnected.current = isOnline;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isRunning, startBackgroundTask]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center gap-3`}>
        <Image
          source={require("@/assets/images/logo/icon-company.png")}
          style={tw`w-[84px] h-[110px]`}
        />
      </SafeAreaView>
    );
  }

  return (
    <ModalProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: tw`bg-[${Colors.background}]`,
        }}
      />
    </ModalProvider>
  );
}
