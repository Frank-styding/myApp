import { ErrorModalProvider } from "@/hooks/ErrorModalProvider";
import { ReturnModalProvider } from "@/hooks/ReturnModalProvider";
import { Stack } from "expo-router";
import { View } from "react-native";
import tw from "twrnc";

export default function Layout() {
  return (
    <ReturnModalProvider>
      <ErrorModalProvider>
        <View style={tw`flex-1`}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: tw`bg-[#2d2d35]`,
            }}
          />
        </View>
      </ErrorModalProvider>
    </ReturnModalProvider>
  );
}
