import { useErrorModal } from "@/hooks/ErrorModalProvider";
import { Image, Modal, Pressable, Text } from "react-native";
import tw from "twrnc";
export const ErrorModal = () => {
  const { hideModal, visible, message } = useErrorModal();
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable
        onPress={() => hideModal()}
        style={tw`flex-1 bg-[rgba(0,0,0,0.6)] justify-center items-center`}
      >
        <Pressable
          style={tw`bg-[#000000] w-72 rounded-xl w-85 py-7 gap-5 items-center`}
          onPress={() => {}}
        >
          <Text style={tw`text-white text-[22px] text-center font-bold`}>
            Error
          </Text>

          <Text style={tw`text-white text-[17px] text-center`}>
            {message || ""}
          </Text>
          <Image
            source={require("@/assets/alert.png")}
            style={tw`w-[15] h-[15]`}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};
