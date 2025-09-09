import { Gallery } from "@/components/ui/Gallery";
import { useAnimatedLogo } from "@/hooks/useAnimatedLogo";
import React from "react";
import { View, Image } from "react-native";
import { DefaultPage } from "./DefaultPage";
import tw from "twrnc";
import { EndPage } from "./EndPage";
import Animated from "react-native-reanimated";

export function OnBoarding({
  onFinishOnboarding,
}: {
  onFinishOnboarding?: () => void;
}) {
  const {
    animatedLogoTitleStyle,
    animatedLogoStyle,
    animatedViewStyle,
    active,
    animatedLogo2Style,
  } = useAnimatedLogo(84, 110);
  return (
    <View style={tw`flex-1`}>
      <Animated.Image
        source={require("@/assets/images/logo/logo2.png")}
        style={[
          animatedLogo2Style,
          tw`absolute w-[51px] h-[31px] bottom-[40px] left-[50%] translate-x-[-25.5px]`,
          { zIndex: 1 },
        ]}
      />
      <Animated.View style={[tw`flex-1 `, animatedViewStyle, { zIndex: 2 }]}>
        <Gallery
          active={active}
          pages={[
            <DefaultPage
              key={"page_0"}
              source={require("@/assets/images/onboarding/image1.png")}
              title="¡Bienvenido, Capitán!"
              message="EG Agroindustrial será tu aliado en el campo. Registra fácilmente las horas de tu equipo y optimiza la jornada. 
¿Listo para una cosecha eficiente?"
            />,
            <DefaultPage
              key={"page_1"}
              source={require("@/assets/images/onboarding/image2.png")}
              title="¡Tu día de trabajo, bajo control!"
              message="EG Agroindustrial será tu aliado en el campo. 
Registra fácilmente las horas de tu equipo. 
¿Listo para una cosecha eficiente?"
            />,
            <EndPage
              key={"page_2"}
              source={require("@/assets/images/onboarding/image3.png")}
              title=" ¡Comencemos la cosecha!"
              onFinishOnboarding={onFinishOnboarding}
            />,
          ]}
        />
      </Animated.View>

      <Animated.Image
        source={require("@/assets/images/logo/icon-company-name.png")}
        style={[tw`w-[115px] h-[110px]  absolute`, animatedLogoTitleStyle]}
      />
      <Animated.Image
        source={require("@/assets/images/logo/icon-company.png")}
        style={[animatedLogoStyle]}
      />
    </View>
  );
}
