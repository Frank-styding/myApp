// components/modals/ErrorModal.tsx
import { Colors, Fonts } from "@/constants/constants";
import { useModalContext } from "@/hooks/ModalProvider";
//import { useAppState } from "@/store/store";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import tw from "twrnc";
//import { Header } from "../layout/home/Header";
import { useState } from "react";

export const EndModal = ({
  onClick,
}: {
  onClick?: (value: string) => void;
}) => {
  const { modals, hideModal } = useModalContext();
  const [state, setState] = useState(0);
  const [reason, setReason] = useState<string>();

  const options = [
    { label: "Falta de materia prima", value: "materiales" },
    { label: "Una hora extra", value: "una hora extra" },
    { label: "Dos horas extras", value: "dos hora extra" },
    { label: "Otros", value: "otros" },
  ];

  const options1 = [
    { label: "!Si,estoy seguro!", value: "seguro" },
    { label: "!No,Sigamos cosechando!", value: "cancelar" },
  ];

  const options2 = [{ label: "Salir", value: "salir" }];

  const titles = [
    "¡Finalizar la cosecha!",
    "¡Finalizar la cosecha!",
    "¡Buen trabajo, Capitán!",
  ];

  const messages = [
    "¿Esta seguro que desea finalizar la cosecha, Capitán?",
    "¿Por que motivo para finalizar la cosecha, Capitán?",
    "Gracias por un día lleno de dedicación. Disfruta de tu descanso, y mañana continuaremos con más fuerza.",
  ];

  const handleClick = (value: string) => {
    if (state === 0) {
      if (value === "seguro") {
        setState(1);
        return;
      }
      if (value === "cancelar") {
        hideModal("end");
        return;
      }
    }
    if (state === 1) {
      setReason(value);
      setState(2);
    }
    if (state === 2) {
      onClick?.(reason as string);
    }
  };

  return (
    <Modal transparent visible={modals.end.visible} animationType="fade">
      <View style={tw`flex-1 justify-end pb-7 items-center z-50`}>
        <View
          style={tw`bg-[${Colors.primary}] w-[94%] h-[690px] rounded-xl gap-5 items-center`}
        >
          <View style={tw`flex-30`}>
            <View
              style={tw`items-center  ${
                state !== 2 ? "gap-8" : "gap-0"
              } pt-10 px-10 ${state !== 2 ? "" : "mb-3"}`}
            >
              <Text
                style={[tw`text-[18px]`, { fontFamily: Fonts["Poppins-Bold"] }]}
              >
                {titles[state]}
              </Text>

              {state === 2 && (
                <Image
                  source={require("@/assets/images/onboarding/image4.png")}
                  style={tw`h-[320px]`}
                />
              )}

              <Text
                style={[
                  tw`text-[17px] font-bold text-center pb-3`,
                  { fontFamily: Fonts["Lato-Bold"] },
                ]}
              >
                {messages[state]}
              </Text>
            </View>

            <View style={tw`mt-3 ${state != 2 ? "flex-12" : "flex-4"}`}>
              <FlatList
                data={state === 0 ? options1 : state === 1 ? options : options2}
                contentContainerStyle={tw`items-center gap-6 py-2`}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={tw`p-3 rounded-[16px] min-w-[285px] min-h-[80px] items-center justify-center bg-[${Colors.black}]`}
                    onPress={() => {
                      handleClick(item.value);
                      /*  onClick?.(item.value); */
                    }}
                  >
                    <Text
                      style={tw`text-[${Colors.light0}] text-[16px] font-bold`}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={tw`flex-3 items-center justify-center`}>
              <Image
                source={require("@/assets/images/logo/logo2_dark.png")}
                style={[tw`w-[61px] h-[37px]`]}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
