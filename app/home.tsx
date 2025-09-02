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
import { getImage } from "@/lib/getImage";
import { isPastSixThirty } from "@/lib/isPastSixThirty";

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
      if (isPastSixThirty()) {
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
      <ReturnModal onClick={onReturn} />
      <ChangeModal callback={callback} />
    </SafeAreaView>
  );
}
