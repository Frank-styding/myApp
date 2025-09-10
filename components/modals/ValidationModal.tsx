import { useModalContext } from "@/hooks/ModalProvider";
import { Image, Modal, Pressable, Text } from "react-native";
import tw from "twrnc";
import { ButtonText } from "../ui/ButtonText";
import { normalize } from "@/lib/normalize";

export const ValidationModal = ({ disabledTap }: { disabledTap?: boolean }) => {
  const { modals, hideModal } = useModalContext();
  const { visible, message, callback } = modals.validation;
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable
        onPress={() => {
          if (disabledTap) return;
          hideModal("validation");
          callback?.(false);
        }}
        style={tw`flex-1 bg-[rgba(0,0,0,0.6)] justify-center items-center`}
      >
        <Pressable
          onPress={() => {}}
          style={tw`bg-[#2d2d35] w-72 rounded-xl w-85 py-7 gap-3 items-center`}
        >
          <Image
            source={require("@/assets/images/logo/logo.png")}
            style={tw`w-[140px] h-[80px] mb-4`}
          />
          <Text
            selectable={false}
            style={tw`text-white text-[${normalize(
              18
            )}px] text-center font-bold`}
          >
            Mensage
          </Text>
          <Text
            selectable={false}
            style={tw`text-[#E0E0E0FF] text-[${normalize(
              16
            )}px] text-center w-70`}
          >
            {message}
          </Text>

          <ButtonText
            text="Continuar"
            style={tw`w-[70%] p-0 py-4 items-center mt-4`}
            textStyle={tw`text-[18px]`}
            onPress={() => {
              hideModal("validation");
              callback?.(true);
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};
