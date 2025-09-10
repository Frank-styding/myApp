import { useModalContext } from "@/hooks/ModalProvider";
import { normalize } from "@/lib/normalize";
import { Modal, Pressable, Text } from "react-native";
import tw from "twrnc";

export const MessageModal = () => {
  const { modals, hideModal } = useModalContext();
  const { visible, message } = modals.message;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable
        onPress={() => hideModal("message")}
        style={tw`flex-1 bg-[rgba(0,0,0,0.6)] justify-center items-center`}
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
            Mensage
          </Text>
          <Text
            selectable={false}
            style={tw`text-white text-[${normalize(17)}px] text-center`}
          >
            {message || ""}
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
