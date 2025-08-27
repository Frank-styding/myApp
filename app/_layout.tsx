import { Colors, fontsMap } from "@/constants/constants";
import { ChangeModalProvider } from "@/hooks/ChangeModalProvider";
import { ErrorModalProvider } from "@/hooks/ErrorModalProvider";
import { ReturnModalProvider } from "@/hooks/ReturnModalProvider";
import { useBackgroundSync } from "@/hooks/useBackgroundSync ";
import { useInternetConnectionHandler } from "@/hooks/useInternetConnection";
import { ValidationModalProvider } from "@/hooks/ValidationModalProvider";
import { backgroundSendTask } from "@/tasks/backgroundSync";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import tw from "twrnc";

export default function Layout() {
  const [fontsLoaded] = useFonts(fontsMap);
  const { checkPermissions, isBackgroundTaskRunning } = useBackgroundSync(
    backgroundSendTask,
    {
      taskName: "DataSyncTask",
      taskTitle: "Sincronizando datos",
      taskDesc: "Enviando datos pendientes...",
      delay: 15000,
    }
  );
  useInternetConnectionHandler(isBackgroundTaskRunning);
  useEffect(() => {
    checkPermissions().then((granted) => {
      if (!granted) {
        Alert.alert(
          "Permisos necesarios",
          "La aplicación necesita permisos para ejecutar en segundo plano. Por favor, concede los permisos necesarios en la configuración de la aplicación.",
          [{ text: "OK" }]
        );
      }
    });
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ChangeModalProvider>
      <ValidationModalProvider>
        <ReturnModalProvider>
          <ErrorModalProvider>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View style={tw`flex-1`}>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: tw`bg-[${Colors.background}]`,
                  }}
                />
              </View>
            </ScrollView>
          </ErrorModalProvider>
        </ReturnModalProvider>
      </ValidationModalProvider>
    </ChangeModalProvider>
  );
}
