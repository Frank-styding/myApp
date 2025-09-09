import { Buttons } from "@/components/layout/home/Buttons";
import { Header } from "@/components/layout/home/Header";
import { ChangeModal } from "@/components/modals/ChangeModal";
import { ReturnModal } from "@/components/modals/ReturnModal";
import { Colors, STATES } from "@/constants/constants";
import { useSaveData } from "@/hooks/useSaveData";
import { useModalContext } from "@/hooks/ModalProvider";
import { useAppState } from "@/store/store";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";
import tw from "twrnc";
import { getImage } from "@/lib/getImage";
import { isPastEndTime, isPastTime } from "@/lib/isPastSixThirty";
import { getBase64Hash, saveImageLocally } from "@/lib/saveImageLocally";
import { ValidationModal } from "@/components/modals/ValidationModal";
import { EndModal } from "@/components/modals/EndModal";

export default function Home() {
  const { showModal, hideModal } = useModalContext();
  const { saveData } = useSaveData();
  const router = useRouter();
  const {
    data,
    setData,
    config,
    setImage,
    image,
    imageHash,
    checkSession,
    setIsWorking,
    setImageHash,
    isWorking,
  } = useAppState();

  /*  useEffect(() => {
    const checkTime = async () => {
      if (isPastEndTime() && isWorking) {
        onEndButton();
      }
    };
    const interval = setInterval(checkTime, 60 * 1000);
    checkTime();
    return () => clearInterval(interval);
  }, [data, isWorking]); */

  useEffect(() => {
    if (!data.dni) return;
    getImage({ dni: data.dni }).then(async ({ image: imageData }) => {
      if (imageData && data.dni) {
        const newHash = await getBase64Hash(imageData.base64);
        if (newHash !== imageHash) {
          const localUri = await saveImageLocally(imageData.base64, data.dni);
          setImage(localUri);
          setImageHash(newHash);
        }
        /*       const uri = `data:${imageData.mimeType};base64,${imageData.base64}`; */
        const localUri = await saveImageLocally(imageData.base64, data.dni);
        setImage(localUri);
      }
    });
  }, []);

  const onClick = async (key: string) => {
    if (key === "button_1") {
      if (isPastTime()) {
        await saveData(STATES["noTrabajando"], { ...data, time: "6:30:00" });
      }
      setIsWorking(true);
      await saveData(STATES["trabajando"], { ...data });
      return;
    }
    if (key === "button_2") {
      //!
      onEndButton();
      /*       if (checkSession()) {
        setIsWorking(false);
      } else {
        setData({});
      }
      router.replace("/login");
      await saveData(STATES["finJornada"], { ...data }); */
      return;
    }
    showModal("return", config.messages[key]);
    await saveData(key, { ...data });
  };

  const onReturn = async () => {
    await saveData(STATES["trabajando"], { ...data });
  };
  const callback = () => {
    setIsWorking(false);

    /* setActive(false); */
  };

  const onEndButton = async () => {
    showModal("end");
    /*     await saveData(STATES["finJornada"], { ...data });
    if (checkSession()) {
      setIsWorking(false);
    } else {
      setData({});
    }
    router.replace("/login"); */
  };

  const onClickEndModal = async (reason: string) => {
    await saveData(STATES["finJornada"], { ...data, reason });
    if (checkSession()) {
      setIsWorking(false);
    } else {
      setData({});
    }
    router.replace("/login");
    hideModal("end");
  };
  return (
    <SafeAreaView style={tw`flex-1 pb-20`}>
      <Header
        name={data.name as string}
        place={data.place as string}
        image={image}
        textStyle1={`text-[${Colors.primary}]`}
        textStyle="text-white font-bold"
      />
      <Buttons options={config.buttons} active={isWorking} onClick={onClick} />
      <ReturnModal onClick={onReturn} />
      <ChangeModal callback={callback} />
      <ValidationModal disabledTap={true} />
      <EndModal onClick={onClickEndModal} />
    </SafeAreaView>
  );
}
