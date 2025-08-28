import { ErrorModal } from "@/components/modals/ErrorModal";
import { ButtonText } from "@/components/ui/ButtonText";
import { Gallery } from "@/components/ui/Gallery";
import { Input } from "@/components/ui/Input";
import { Picker } from "@/components/ui/Picker";
import { Colors, Fonts, select_options } from "@/constants/constants";
import { useAnimatedLogo } from "@/hooks/useAnimatedLogo";
import { useModalContext } from "@/providers/ModalProvider";
import { useAppState } from "@/store/store";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

export function Loggin() {
  const [data, setData] = useState<{
    value?: string;
    name?: string;
    dni?: string;
  }>({});
  const { showModal } = useModalContext();
  const router = useRouter();
  const { setValue } = useAppState();

  useEffect(() => {
    if (data.dni && data.name && data.value) {
      router.replace("/home");
    }
  }, []);

  const onClick = () => {
    if (!data.dni || !data.name || !data.value) {
      showModal("error", "Por favor complete todos los campos");
      return;
    }
    if (data.dni.length < 8) {
      showModal("error", "El DNI debe contar con 8 caracteres");
      return;
    }

    setValue(data);
    router.replace("/home");
  };

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-4 items-center justify-center`}>
        <Image
          source={require("../assets/logo.png")}
          style={{ height: 150, width: 230 }}
        />
      </View>
      <View style={tw`flex-3 px-3 gap-4`}>
        <View style={tw`gap-3`}>
          <Text style={tw`text-white text-[20px] `}>Bienvenido capitán</Text>
          <Input
            placeholder="Nombre de capitan"
            onChangeText={(value) => setData({ ...data, name: value })}
          />
          <Input
            placeholder="Ingrese DNI"
            keyboardType="number-pad"
            maxLength={8}
            onChangeText={(value) => setData({ ...data, dni: value })}
          />
        </View>
        <View style={tw`gap-3`}>
          <Text style={tw`text-white text-[20px] `}>Selecione fundo</Text>
          <Picker
            placeholder="N° de fundo"
            value={data.value ? `N° ${data.value}` : ""}
            options={select_options}
            onSelect={(value) => setData({ ...data, value })}
          />
        </View>
      </View>
      <View style={tw`flex-3 items-center pt-10`}>
        <ButtonText text="Comencemos" onClick={onClick} />
      </View>
      <ErrorModal />
    </View>
  );
}

const DefaultPage = ({
  source,
  title,
  message,
}: {
  source: ImageSourcePropType;
  title: string;
  message: string;
}) => {
  return (
    <View style={tw`flex-1`}>
      <View style={[tw`flex-4 items-center justify-center pt-40`]}>
        <Image source={source} />
      </View>
      <View style={tw`flex-1 items-center gap-4 justify-center`}>
        <Text
          style={[
            tw`text-[18px] text-[${Colors.primary}] text-center`,
            { fontFamily: Fonts["Poppins-Bold"] },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            tw`text-[18px] text-[${Colors.light0}] text-center`,
            ,
            { fontFamily: Fonts["Lato-Regular"] },
          ]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
};

const EndPage = ({
  source,
  title,
}: {
  source: ImageSourcePropType;
  title: string;
}) => {
  return (
    <View style={tw`flex-1`}>
      <View style={[tw`flex-4 items-center justify-center pt-40`]}>
        <Image source={source} />
      </View>
      <View style={tw`flex-1 items-center gap-4 justify-center`}>
        <Text
          style={[
            tw`text-[18px] text-[${Colors.primary}] text-center`,
            { fontFamily: Fonts["Poppins-Bold"] },
          ]}
        >
          {title}
        </Text>
        <ButtonText
          text="Ingresar"
          style={tw`w-[230px] h-[50px] p-0 bg-[${Colors.black2}]`}
          textStyle={tw`text-[${Colors.light0}]`}
        />
      </View>
    </View>
  );
};
export function OnBoarding() {
  const {
    animatedLogoTitleStyle,
    animatedLogoStyle,
    animatedViewStyle,
    active,
  } = useAnimatedLogo(84, 110);
  /*     "width": 386,
    "height": 369 */
  return (
    <SafeAreaView style={tw`flex-1 `}>
      <View style={tw`flex-1`}>
        <Animated.View style={[tw`flex-1 `, animatedViewStyle]}>
          <Gallery
            active={active}
            pages={[
              <DefaultPage
                key={"page_0"}
                source={require("@/assets/image1.png")}
                title="¡Bienvenido, Capitán!"
                message="EG Agrícola será tu aliado en el campo. Registra fácilmente las horas de tu equipo y optimiza la jornada. 
¿Listo para una cosecha eficiente?"
              />,
              <DefaultPage
                key={"page_1"}
                source={require("@/assets/image2.png")}
                title="¡Tu día de trabajo, Bajo control!"
                message="EG Agrícola será tu aliado en el campo. 
Registra fácilmente las horas de tu equipo. 
¿Listo para una cosecha eficiente?"
              />,
              <EndPage
                key={"page_2"}
                source={require("@/assets/image3.png")}
                title="¡Comencemos la cosecha!"
              />,
            ]}
          />
        </Animated.View>
        <Animated.Image
          source={require("@/assets/icon-company-name.png")}
          style={[tw`w-[115px] h-[110px]  absolute`, animatedLogoTitleStyle]}
        />
        <Animated.Image
          source={require("@/assets/icon-company.png")}
          style={[animatedLogoStyle]}
        />
      </View>
    </SafeAreaView>
  );
}
export default function Index() {
  return <OnBoarding />;
}
