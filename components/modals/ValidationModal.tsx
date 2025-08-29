import { useModalContext } from "@/hooks/ModalProvider";
import { Modal, Pressable, Text } from "react-native";
import tw from "twrnc";

export const ValidationModal = () => {
  const { modals, hideModal } = useModalContext();
  const { visible, message } = modals.validation;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable
        onPress={() => hideModal("validation")}
        style={tw`flex-1 bg-[rgba(0,0,0,0.6)] justify-center items-center`}
      >
        <Pressable
          style={tw`bg-[#000000] w-72 rounded-xl w-85 py-7 gap-5 items-center`}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={tw`text-white text-[22px] text-center font-bold`}>
            Mensage
          </Text>
          <Text style={tw`text-white text-[17px] text-center`}>
            {message || ""}
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
