import { Colors, fontsMap } from "@/constants/constants";
import { useBackgroundSync } from "@/hooks/useBackgroundSync";
import { ModalProvider } from "@/providers/ModalProvider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import tw from "twrnc";

export default function Layout() {
  const [fontsLoaded] = useFonts(fontsMap);
  const { checkPermissions, startBackgroundTask } = useBackgroundSync();
  useEffect(() => {
    checkPermissions().then((granted) => {
      if (!granted) {
        Alert.alert(
          "Permisos necesarios",
          "Necesitas conceder permisos de notificaciones para sincronizar en segundo plano."
        );
      } else {
        startBackgroundTask(); // arranca la sync en segundo plano
      }
    });
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={tw`flex-1`}>
        <ModalProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: tw`bg-[${Colors.background}]`,
            }}
          />
        </ModalProvider>
      </View>
    </ScrollView>
  );
}
