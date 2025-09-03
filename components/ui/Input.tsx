import { Colors, Fonts } from "@/constants/constants";
import {
  KeyboardTypeOptions,
  TextInput,
  TextStyle,
  View,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons"; // expo install @expo/vector-icons
import { useState } from "react";

interface InputProps {
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  fontFamily?: string;
  onChangeText?: (text: string) => void;
  style?: TextStyle;
  defaultValue?: string;
  value?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
}

export const Input = ({
  fontFamily,
  keyboardType,
  maxLength,
  onChangeText,
  placeholder,
  style,
  defaultValue,
  value,
  secureTextEntry,
  disabled,
}: InputProps) => {
  const [secure, setSecure] = useState(!!secureTextEntry);

  return (
    <View
      style={tw`flex-row items-center bg-[${Colors.light3}] w-full h-10 rounded-[8px] px-3`}
    >
      <TextInput
        style={[
          {
            fontFamily: fontFamily || Fonts["Poppins-Bold"],
          },
          tw`flex-1 text-[16px] text-[${Colors.black}] font-bold`,
          style,
        ]}
        keyboardType={keyboardType}
        placeholder={placeholder}
        maxLength={maxLength}
        defaultValue={defaultValue}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        editable={!disabled}
        value={value}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Ionicons
            name={secure ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
