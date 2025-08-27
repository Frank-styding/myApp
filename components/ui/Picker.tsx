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

export const Picker = ({
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
      <Pressable
        onPress={() => setVisible(true)}
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

      <Modal transparent visible={visible} animationType="fade">
        <Pressable
          onPress={() => setVisible(false)}
          style={tw`flex-1 bg-[rgba(0,0,0,0.6)] justify-center items-center`}
        >
          <Pressable
            style={tw`bg-[${Colors.background}] w-72 rounded-xl p-4 items-center`}
            onPress={() => {}}
          >
            <Text style={tw`text-[20px] font-bold text-white mb-6`}>
              Elige una opción
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={tw`p-3 rounded-lg min-w-full items-center mb-2 bg-[#bababa]`}
                  onPress={() => {
                    onSelect?.(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={tw`text-black text-[18px] font-bold`}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
