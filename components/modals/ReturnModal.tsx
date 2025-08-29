// components/modals/ReturnModal.tsx
import { useModalContext } from "@/hooks/ModalProvider";
import { Image, Modal, Text, View } from "react-native";
import tw from "twrnc";
import { ButtonText } from "../ui/ButtonText";

export const ReturnModal = ({ onClick }: { onClick?: () => void }) => {
  const { modals, hideModal } = useModalContext();
  const { visible, title, message } = modals.return;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={tw`flex-1 bg-[rgba(0,0,0,0.6)] justify-center items-center`}>
        <View
          style={tw`bg-[#2d2d35] w-72 rounded-xl w-85 py-7 gap-3 items-center`}
        >
          <Image
            source={require("@/assets/images/logo/logo.png")}
            style={tw`w-[110px] h-[70px] mb-4`}
          />
          <Text style={tw`text-white text-[18px] text-center font-bold`}>
            {title}
          </Text>
          <Text style={tw`text-[#E0E0E0FF] text-[16px] text-center w-70`}>
            {message}
          </Text>

          <ButtonText
            text="! Volvamos a cosechar !"
            style={tw`w-[70%] p-0 py-4 items-center mt-4`}
            textStyle={tw`text-[18px]`}
            onPress={() => {
              hideModal("return");
              onClick?.();
            }}
          />
        </View>
      </View>
    </Modal>
  );
};
