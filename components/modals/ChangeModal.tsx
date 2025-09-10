// components/modals/ChangeModal.tsx
import { useAppState } from "@/store/store";
import { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { ButtonText } from "../ui/ButtonText";
import { PlacePicker } from "../ui/PlacePicker";
import { useSaveData } from "@/hooks/useSaveData";
import { Colors, STATES } from "@/constants/constants";
import { normalize } from "@/lib/normalize";
import { useModalContext } from "@/hooks/ModalProvider";

export const ChangeModal = ({ callback }: { callback?: () => void }) => {
  const { hideModal, modals } = useModalContext();
  const { data, setData, config } = useAppState();
  const [option, setOption] = useState<string>();
  const { saveData } = useSaveData();

  const handleClick = () => {
    callback?.();
    saveData(STATES["finJornada"], { ...data });
    setData({ ...data, place: option }, () => {
      saveData(STATES["transladoFundo"], { ...data, place: option }).then(
        () => {
          hideModal("change");
        }
      );
    });
  };

  return (
    <Modal transparent visible={modals.change.visible} animationType="fade">
      <Pressable
        onPress={() => hideModal("change")}
        style={tw`flex-1 bg-[rgba(0,0,0,0.6)] justify-center items-center`}
      >
        <Pressable
          style={tw`bg-[${Colors.black2}] w-[70%] rounded-xl w-85 py-7 gap-5 items-center`}
          onPress={(e) => e.stopPropagation()}
        >
          <Image
            source={require("@/assets/images/icons/changeIcon.png")}
            style={tw`w-15 h-15`}
          />
          <View style={tw`flex-row w-72 justify-between`}>
            <View style={tw`items-start`}>
              <Text
                selectable={false}
                style={tw`text-[${normalize(18)}px] text-white`}
              >
                Fundo Actual
              </Text>
              <Text
                selectable={false}
                style={tw`p-2 w-[35] rounded-[8px] bg-[${Colors.black}] text-[${
                  Colors.light3
                }] text-[${normalize(18)}px]`}
              >{`Fundo N°${data.place}`}</Text>
            </View>
            <View>
              <Text selectable={false} style={tw`text-[18px] text-white`}>
                Nuevo Fundo
              </Text>
              <PlacePicker
                placeholder="N° de fundo"
                style={tw`w-[35] bg-[${Colors.black}]`}
                textStyle={tw`text-[${Colors.light3}] text-[${normalize(
                  18
                )}px]`}
                options={config.select_options}
                value={option ? `Fundo N°${option}` : undefined}
                onSelect={setOption}
              />
            </View>
          </View>
          <View>
            <ButtonText
              text="Cambiar de fundo"
              style={tw`h-10 p-0 w-[70] rounded-[8px]`}
              onPress={handleClick}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
