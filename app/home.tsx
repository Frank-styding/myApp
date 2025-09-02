import { Buttons } from "@/components/layout/home/Buttons";
import { Header } from "@/components/layout/home/Header";
import { ChangeModal } from "@/components/modals/ChangeModal";
import { ReturnModal } from "@/components/modals/ReturnModal";
import { STATES } from "@/constants/constants";
import { useSaveData } from "@/hooks/useSaveData";
import { useModalContext } from "@/hooks/ModalProvider";
import { useAppState } from "@/store/store";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

import tw from "twrnc";
import { getCurrentTime } from "@/utils/getCurrentTime";
import { compareHours } from "@/utils/compareHours";
import { getImage } from "@/lib/getImage";

/* function ChangeButton({
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
} */

export default function Home() {
  const { showModal } = useModalContext();
  const { saveData } = useSaveData();
  const [active, setActive] = useState(false);
  const router = useRouter();
  const { data, setData, config, setImage, image } = useAppState();

  useEffect(() => {
    if (!data.dni) return;
    getImage({ dni: data.dni }).then(({ image: imageData }) => {
      if (imageData) {
        const uri = `data:${imageData.mimeType};base64,${imageData.base64}`;
        setImage(uri);
      }
    });
  }, []);

  const onClick = (key: string) => {
    if (key === "button_1") {
      if (compareHours(getCurrentTime(), "6:30:00") > 0) {
        saveData(STATES["noTrabajando"], { ...data, time: "6:30:00" });
      }
      saveData(STATES["trabajando"], { ...data });
      setActive(true);
      return;
    }
    if (key === "button_2") {
      setData({});
      saveData(STATES["finJornada"], { ...data });
      router.replace("/login");
      return;
    }
    showModal("return", config.messages[key]);
    saveData(key, { ...data });
  };

  const onChange = () => {
    showModal("change");
  };

  const onReturn = () => {
    saveData(STATES["trabajando"], { ...data });
  };

  const callback = () => {
    setActive(false);
  };

  return (
    <SafeAreaView style={tw`flex-1 pb-13`}>
      <Header
        name={data.name as string}
        place={data.place as string}
        image={image}
      />
      <Buttons options={config.buttons} active={active} onClick={onClick} />
      {/* <ChangeButton disabled={!active} onClick={onChange} /> */}
      <ReturnModal onClick={onReturn} />
      <ChangeModal callback={callback} />
    </SafeAreaView>
  );
}
