import { Button } from "@/components/Button";
import { CustomPicker } from "@/components/CustromPicker";
import { ErrorModal } from "@/components/modals/ErrorModal";
import { useErrorModal } from "@/hooks/ErrorModalProvider";
import { useAppState } from "@/store/store";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardTypeOptions,
  Text,
  TextInput,
  View,
} from "react-native";
import tw from "twrnc";

const Input = ({
  placeholder,
  keyboardType,
  onChange,
  maxLength,
}: {
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  onChange?: (text: string) => void;
}) => {
  return (
    <TextInput
      style={tw`bg-[#bababa] w-full h-10 rounded-[8px] pl-3 text-[16px] text-black font-bold`}
      keyboardType={keyboardType}
      maxLength={maxLength}
      placeholder={placeholder}
      onChangeText={onChange}
    />
  );
};

export default function Loggin() {
  const [data, setData] = useState<{
    value?: string;
    name?: string;
    dni?: string;
  }>({});
  const { showModal } = useErrorModal();
  const router = useRouter();
  const { setValue } = useAppState();

  const options = [
    { label: "N°1", value: "1" },
    { label: "N°2", value: "2" },
    { label: "N°3", value: "3" },
    { label: "N°4", value: "4" },
    { label: "N°5", value: "5" },
  ];

  const onClick = () => {
    if (!data.dni || !data.name || !data.value) return;
    if (data.dni.length < 8) {
      showModal("El DNI debe contar con 8 caracteres");
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
            onChange={(value) => setData({ ...data, name: value })}
          />
          <Input
            placeholder="Ingrese DNI"
            keyboardType="numeric"
            maxLength={8}
            onChange={(value) => setData({ ...data, dni: value })}
          />
        </View>
        <View style={tw`gap-3`}>
          <Text style={tw`text-white text-[20px] `}>Selecione fundo</Text>
          <CustomPicker
            placeholder="N° de fundo"
            value={data.value ? `N° ${data.value}` : ""}
            options={options}
            onSelect={(value) => setData({ ...data, value })}
          />
        </View>
      </View>
      <View style={tw`flex-3 items-center pt-10`}>
        <Button text="Comencemos" onClick={onClick} />
      </View>
      <ErrorModal />
    </View>
  );
}
