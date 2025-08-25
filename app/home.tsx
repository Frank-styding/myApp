import { Button } from "@/components/Button";
import { ButtonIcon } from "@/components/ButtonIcon";
import { ReturnModal } from "@/components/modals/ReturnModal";
import { API_URL } from "@/constants/constants";
import { useReturnModal } from "@/hooks/ReturnModalProvider";
import { usePost } from "@/hooks/usePost";
import { useAppState } from "@/store/store";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import tw from "twrnc";

function UserData({ name, place }: { name: string; place: string }) {
  return (
    <View
      style={tw`flex-3 justify-between flex-row items-center px-8 content-center pt-3`}
    >
      <View>
        <View style={tw`flex-row gap-2`}>
          <Text style={tw`text-[18px] text-[#CACACA]`}>Capitan</Text>
          <Text style={tw`text-[18px] text-white font-bold`}>{name}</Text>
        </View>
        <View style={tw`flex-row gap-2`}>
          <Text style={tw`text-[18px] text-[#CACACA]`}>Fundo</Text>
          <Text style={tw`text-[18px] text-white font-bold`}>N° {place}</Text>
        </View>
      </View>
      <Ionicons name="settings-sharp" size={30} color={"white"} />
    </View>
  );
}

function Buttons({
  options,
  onClick,
  active,
}: {
  options: { label: string; value: string }[];
  onClick?: (key: string) => void;
  active?: boolean;
}) {
  return (
    <View style={tw`flex-15`}>
      <View style={tw`flex-1 items-center justify-center`}>
        <Button
          text="Comencemos a cosechar"
          style={tw`w-90 items-center p-0 h-[88px] justify-center ${
            active ? "bg-[#bababa]" : ""
          }`}
          disabled={active}
          onClick={() => onClick?.("button_1")}
        />
      </View>
      <Text style={tw`text-[#d5d5d7] pl-5  text-[18px] `}>
        Tiempos de espera
      </Text>
      <View
        style={tw`flex-4 flex-wrap flex-row gap-3 justify-center  content-center`}
      >
        {options.map(({ label, value }) => (
          <TouchableOpacity
            style={tw`w-43 h-20 ${
              active
                ? "bg-[#000000] shadow-xl shadow-[#DEFF8BFF]"
                : "bg-[#bababa]"
            } rounded-[8px] items-center justify-center p-1`}
            onPress={() => onClick?.(value)}
            disabled={!active}
            key={label}
          >
            <Text style={tw`text-white text-[14px] text-center`}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={tw`flex-1 items-center justify-center mt-1`}>
        <Button
          text="Finalizar cosecha"
          style={tw`w-90 items-center p-0 h-[88px] justify-center ${
            !active ? "bg-[#bababa]" : ""
          }`}
          onClick={() => onClick?.("button_2")}
        />
      </View>
    </View>
  );
}

function ChangeButton({ onClick }: { onClick?: () => void }) {
  return (
    <View style={tw`flex-2 justify-end items-center pb-3`}>
      <ButtonIcon
        style={tw`w-90 items-center bg-[#bababa]`}
        onClick={() => onClick?.()}
      >
        <FontAwesome name="exchange" size={24} color="black" />
      </ButtonIcon>
    </View>
  );
}

function getFormattedDate(): string {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0"); // dd
  const month = String(today.getMonth() + 1).padStart(2, "0"); // mm (0 indexado)
  const year = today.getFullYear(); // yyyy

  return `${day}-${month}-${year}`;
}

function getCurrentTime(): string {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0"); // HH
  const minutes = String(now.getMinutes()).padStart(2, "0"); // MM
  const seconds = String(now.getSeconds()).padStart(2, "0"); // SS

  return `${hours}:${minutes}:${seconds}`;
}

export default function Home() {
  const { showModal } = useReturnModal();
  const [active, setActive] = useState(false);
  const router = useRouter();
  const { data } = useAppState();
  const { postData } = usePost();

  const options = [
    { label: "Almuerzo", value: "almuerzo" },
    { label: "Falta de materiales", value: "materiales" },
    { label: "Traslados internos", value: "traslado interno" },
    { label: "Causas Climatólogicas", value: "problemas climaticos" },
    { label: "Charlas & Reuniones", value: "charla" },
    { label: "Pausas Activas", value: "pausa" },
    { label: "Falta de Materia prima", value: "materia prima" },
    { label: "Repaso", value: "repaso" },
  ];

  const sendData = (state: string) => {
    postData(API_URL, {
      type: "insertFormat_1",
      data: {
        spreadsheetName: "cosecha_" + getFormattedDate(),
        sheetName: `fundo_${data.value}`,
        data: {
          tableName: data.name,
          tableData: { capitan: data.name, dni: data.dni },
          items: [
            {
              inicio: getCurrentTime(),
              estado: state,
            },
          ],
        },
      },
      timestamp: Math.floor(Date.now() / 1000),
    });
  };
  const onClick = (key: string) => {
    if (key === "button_1") {
      sendData("Trabajando");
      setActive(true);
      return;
    }
    if (key === "button_2") {
      sendData("fin jornada");
      router.replace("/");
      return;
    }
    showModal({
      message: "¡Disfruta del almuerzo, Capitán!",
      title: `Recargar energías es la mejor inversión
para una tarde productiva.
¡Te esperamos!`,
    });
    sendData(key);
  };

  const onReturn = () => {
    sendData("Trabajando");
  };

  return (
    <SafeAreaView style={tw`flex-1 pt-5`}>
      <UserData name={data.name as string} place={data.value as string} />
      <Buttons options={options} active={active} onClick={onClick} />
      <ChangeButton />
      <ReturnModal onClick={onReturn} />
    </SafeAreaView>
  );
}
