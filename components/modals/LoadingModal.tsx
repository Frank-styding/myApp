import { useModalContext } from "@/hooks/ModalProvider";
import { ActivityIndicator, Modal, Pressable, Text } from "react-native";
import tw from "twrnc";
import { Colors } from "@/constants/constants";
import { normalize } from "@/lib/normalize";
import { SvgSpinner } from "../ui/SvgSpinner";

export const LoadingModal = () => {
  const { hideModal, modals } = useModalContext();

  return (
    <Modal
      transparent
      visible={modals.loading.visible}
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable
        /* onPress={() => hideModal("loading")} */
        style={tw`flex-1 bg-[rgba(0,0,0,0.6)] justify-center items-center z-50`}
      >
        <Pressable
          style={tw`bg-[${Colors.black}] w-72 rounded-xl py-7 px-5 gap-5 items-center`}
          onPress={(e) => e.stopPropagation()}
        >
          {/* <ActivityIndicator
            size="large"
            color={Colors.primary}
            animating={true}
          /> */}
          <SvgSpinner size={80} color={Colors.primary} />

          <Text
            selectable={false}
            style={tw`text-white text-[${normalize(18)}px] text-center`}
          >
            {modals.loading.message}
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
