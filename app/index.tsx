import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { enableScreens } from "react-native-screens";
import { OnBoarding } from "@/components/layout/onBoarding/onBoarding";

const FIRST_TIME_KEY = "@first_time_app";
enableScreens();

export default function Index() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem(FIRST_TIME_KEY);

      if (hasSeenOnboarding === null) {
        setIsFirstTime(true);
      } else {
        setIsFirstTime(false);
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error checking first time:", error);
      setIsFirstTime(true);
    }
  };

  const handleFinishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(FIRST_TIME_KEY, "false");
      router.replace("/login");
    } catch (error) {
      console.error("Error saving onboarding completion:", error);
      router.replace("/login");
    }
  };
  if (isFirstTime === null) {
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
    <SafeAreaView style={tw`flex-1`}>
      <OnBoarding onFinishOnboarding={handleFinishOnboarding} />
    </SafeAreaView>
  );
}
