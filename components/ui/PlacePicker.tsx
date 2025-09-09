import { Colors, Fonts } from "@/constants/constants";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  Image,
} from "react-native";
import tw from "twrnc";
interface PickerProps {
  placeholder?: string;
  options?: {
    label: string;
    value: string;
  }[];
  value?: string;
  fontFamily?: string;
  onSelect?: (value: string) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PlacePicker = ({
  placeholder,
  options,
  value,
  onSelect,
  fontFamily,
  textStyle,
  style,
}: PickerProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={tw`items-center justify-center`}>
      {/* Selector */}
      <Pressable
        onPress={() => {
          setVisible(true);
        }}
        style={[
          tw`bg-[${Colors.light3}] w-full h-10 rounded-lg px-3 flex-row justify-between items-center`,
          style,
        ]}
      >
        <Text
          style={[
            tw`${
              value ? "text-black" : `text-[${Colors.black1}]`
            } text-[16px] font-bold`,
            {
              fontFamily: fontFamily || Fonts["Lato-Bold"],
            },
            textStyle,
          ]}
        >
          {value ? value : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={`${Colors.black1}`} />
      </Pressable>

      {/* Modal */}
      <Modal transparent visible={visible} animationType="fade">
        <Pressable
          onPress={() => setVisible(false)}
          style={tw`flex-1 bg-[rgba(0,0,0,0.6)] justify-center items-center`}
        >
          <Pressable
            style={tw`bg-[${Colors.black}] w-[368px] h-[590px] rounded-xl p-4 items-center`}
            onPress={() => {}}
          >
            <Text
              style={tw`h-[50px] text-[22px] font-bold text-[${Colors.primary}] mb-6 text-center`}
            >
              ¡Seleccione su fundo, Capitán!
            </Text>
            <View style={tw`h-[100]`}>
              <FlatList
                data={options}
                contentContainerStyle={tw`items-center gap-4 py-2`}
                showsVerticalScrollIndicator={true}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={tw`p-3 rounded-[16px] min-w-[90%] min-h-[60px] items-center justify-center bg-[${Colors.black1}]`}
                    onPress={() => {
                      onSelect?.(item.value);
                      setVisible(false);
                    }}
                  >
                    <Text
                      style={tw`text-[${Colors.light0}] text-[18px] font-bold`}
                    >
                      {`Fundo ${item.label}`}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <Image
              source={require("@/assets/images/logo/icon-company.png")}
              style={tw`w-[60px] h-[80px] mt-3`}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
