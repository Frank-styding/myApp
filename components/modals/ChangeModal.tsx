import { Colors, select_options, STATES } from "@/constants/constants";
import { useChangeModal } from "@/hooks/ChangeModalProvider";
import { useAppState } from "@/store/store";
import { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { ButtonText } from "../ui/ButtonText";
import { Picker } from "../ui/Picker";
import { useSaveData } from "@/hooks/useSaveData";
export const ChangeModal = () => {
  const { hideModal, visible } = useChangeModal();
  const { data, setValue } = useAppState();
  const [option, setOption] = useState<string>();
  const { saveData } = useSaveData();
  const handleClick = () => {
    saveData(STATES["fin jornada"], undefined, { ...data });
    setValue({ ...data, value: option }, () => {
      saveData(STATES["trabajando"], undefined, { ...data, value: option });
      hideModal();
    });
  };
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable
        onPress={() => hideModal()}
        style={tw`flex-1 bg-[rgba(0,0,0,0.6)] justify-center items-center`}
      >
        <Pressable
          style={tw`bg-[${Colors.black2}] w-72 rounded-xl w-85 py-7 gap-5 items-center`}
          onPress={() => {}}
        >
          <Image
            source={require("@/assets/changeIcon.png")}
            style={tw`w-15 h-15`}
          />
          <View style={tw`flex-row w-72 justify-between`}>
            <View style={tw`items-start`}>
              <Text style={tw`text-[18px] text-white`}>Fundo Actual</Text>
              <Text
                style={tw`p-2 w-[35] rounded-[8px] bg-[${Colors.black}] text-[${Colors.light3}] text-[18px]`}
              >{`Fundo N°${data.value}`}</Text>
            </View>
            <View>
              <Text style={tw`text-[18px] text-white`}>Nuevo Fundo</Text>
              <Picker
                placeholder="N° de fundo"
                style={tw`w-[35] bg-[${Colors.black}]`}
                textStyle={tw`text-[${Colors.light3}] text-[18px]`}
                options={select_options}
                value={option ? `Fundo N°${option}` : undefined}
                onSelect={setOption}
              />
            </View>
          </View>
          <View>
            <ButtonText
              text="Cambiar de fundo"
              style={tw`h-10 p-0 w-[70] rounded-[8px]`}
              onClick={handleClick}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
