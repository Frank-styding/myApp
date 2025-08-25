import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
export const CustomPicker = ({
  placeholder,
  options,
  value,
  onSelect,
}: {
  placeholder?: string;
  options?: { label: string; value: string }[];
  value?: string;
  onSelect?: (value: string) => void;
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={tw`items-center justify-center bg-[#2d2d35]`}>
      <Pressable
        onPress={() => setVisible(true)}
        style={tw`bg-[#bababa] w-full h-10 rounded-lg px-3 flex-row justify-between items-center`}
      >
        <Text
          style={tw`${
            value ? "text-black" : "text-[#464646]"
          } text-[16px] font-bold`}
        >
          {value ? value : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="black" />
      </Pressable>

      <Modal transparent visible={visible} animationType="fade">
        <Pressable
          onPress={() => setVisible(false)}
          style={tw`flex-1 bg-[rgba(0,0,0,0.6)] justify-center items-center`}
        >
          <Pressable
            style={tw`bg-[#2d2d35] w-72 rounded-xl p-4 items-center`}
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
