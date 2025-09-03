import { Colors, fontsMap } from "@/constants/constants";
import { ModalProvider } from "@/hooks/ModalProvider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";
import { Image, SafeAreaView } from "react-native";
import tw from "twrnc";

export default function Layout() {
  const [fontsLoaded] = useFonts(fontsMap);

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
