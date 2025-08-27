import { Buttons } from "@/components/layout/home/Buttons";
import { Header } from "@/components/layout/home/Header";
import { ChangeModal } from "@/components/modals/ChangeModal";
import { ReturnModal } from "@/components/modals/ReturnModal";
import { Button } from "@/components/ui/Button";
import {
  Colors,
  Messages,
  STATES,
  button_options,
} from "@/constants/constants";
import { useChangeModal } from "@/hooks/ChangeModalProvider";
import { useReturnModal } from "@/hooks/ReturnModalProvider";
import { useSaveData } from "@/hooks/useSaveData";
import { useAppState } from "@/store/store";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, View } from "react-native";

import tw from "twrnc";

function ChangeButton({
  onClick,
  disabled,
}: {
  onClick?: () => void;
  disabled: boolean;
}) {
  return (
    <View style={tw`flex-2 justify-end items-center pb-3`}>
      <Button
        style={tw`w-90 items-center ${
          disabled ? `bg-[${Colors.light3}]` : `bg-[${Colors.black2}]`
        }`}
        onClick={() => onClick?.()}
        disabled={disabled}
      >
        <FontAwesome name="exchange" size={24} color="black" />
      </Button>
    </View>
  );
}

export default function Home() {
  const { showModal } = useReturnModal();
  const { showModal: showChangeModal } = useChangeModal();
  const { saveData } = useSaveData();
  const [active, setActive] = useState(false);
  const router = useRouter();
  const { data, setValue } = useAppState();

  const onClick = (key: string) => {
    if (key === "button_1") {
      saveData(STATES["trabajando"]);
      setActive(true);
      return;
    }
    if (key === "button_2") {
      setValue({});
      saveData(STATES["fin jornada"]);
      router.replace("/");
      return;
    }
    showModal(Messages[key]);
    saveData(key);
  };

  const onChange = () => {
    showChangeModal();
  };

  const onReturn = () => {
    saveData("Trabajando");
  };

  return (
    <SafeAreaView style={tw`flex-1 pt-5`}>
      <Header name={data.name as string} place={data.value as string} />
      <Buttons options={button_options} active={active} onClick={onClick} />
      <ChangeButton disabled={!active} onClick={onChange} />
      <ReturnModal onClick={onReturn} />
      <ChangeModal />
    </SafeAreaView>
  );
}
