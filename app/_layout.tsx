import { Colors, fontsMap } from "@/constants/constants";
import { useBackgroundSync } from "@/hooks/useBackgroundSync";
import { ModalProvider } from "@/hooks/ModalProvider";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Alert, SafeAreaView } from "react-native";
import tw from "twrnc";
/* import { useIsFirstTime } from "@/hooks/isFirstTime"; */
import AsyncStorage from "@react-native-async-storage/async-storage";
const FIRST_TIME_KEY = "@first_time_app";

export default function Layout() {
  const [fontsLoaded] = useFonts(fontsMap);
  const { checkPermissions, startBackgroundTask, isRunning } =
    useBackgroundSync();

  useEffect(() => {
    AsyncStorage.getItem(FIRST_TIME_KEY).then((value) => {
      if (value == null || value == "true") return;
      checkPermissions().then((granted) => {
        if (!granted) {
          Alert.alert(
            "Permisos necesarios",
            "Necesitas conceder permisos de notificaciones para sincronizar en segundo plano."
          );
        } else {
          if (!isRunning) {
            startBackgroundTask(); // arranca la sync en segundo plano
          }
        }
      });
    });
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
          contentStyle: tw`bg-[${Colors.background}]`,
        }}
      />
    </ModalProvider>
  );
}
