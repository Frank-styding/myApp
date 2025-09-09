// components/modals/ErrorModal.tsx
import { useModalContext } from "@/hooks/ModalProvider";
import { normalize } from "@/lib/normalize";
import { Image, Modal, Pressable, Text } from "react-native";
import tw from "twrnc";

export const ErrorModal = () => {
  const { hideModal, modals } = useModalContext();

  return (
    <Modal transparent visible={modals.error.visible} animationType="fade">
      <Pressable
        onPress={() => hideModal("error")}
        style={tw`flex-1 bg-[rgba(0,0,0,0.6)] justify-center items-center z-50`}
      >
        <Pressable
          style={tw`bg-[#000000] w-72 rounded-xl w-85 py-7 gap-5 items-center`}
          onPress={(e) => e.stopPropagation()}
        >
          <Text
            style={tw`text-white text-[${normalize(
              22
            )}px] text-center font-bold`}
          >
            Error
          </Text>

          <Text style={tw`text-white text-[${normalize(17)}px] text-center`}>
            {modals.error.message || ""}
          </Text>
          <Image
            source={require("@/assets/images/icons/alert.png")}
            style={tw`w-[20] h-[20]`}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};
