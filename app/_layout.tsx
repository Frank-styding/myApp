import { Colors, fontsMap } from "@/constants/constants";
import { ModalProvider } from "@/hooks/ModalProvider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { Image, SafeAreaView } from "react-native";
import NetInfo, { NetInfoSubscription } from "@react-native-community/netinfo";
import tw from "twrnc";
import { useBackgroundSync } from "@/hooks/useBackgroundSync";

export default function Layout() {
  const [fontsLoaded] = useFonts(fontsMap);
  const { isRunning, startBackgroundTask } = useBackgroundSync();

  useEffect(() => {
    let unsubscribe: NetInfoSubscription;

    unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && !isRunning) {
        startBackgroundTask();
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

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
