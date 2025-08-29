import { ErrorModal } from "@/components/modals/ErrorModal";
import { ButtonText } from "@/components/ui/ButtonText";
import { Input } from "@/components/ui/Input";
import { Picker } from "@/components/ui/Picker";
import { select_options } from "@/constants/constants";
import { useModalContext } from "@/hooks/ModalProvider";
import { useAppState } from "@/store/store";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Image, Text } from "react-native";
import tw from "twrnc";

export default function Login() {
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
          source={require("../assets/images/logo/logo.png")}
          style={{ height: 195, width: 299 }}
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
        <ButtonText text="Comencemos" onPress={onClick} />
      </View>
      <ErrorModal />
    </View>
  );
}
