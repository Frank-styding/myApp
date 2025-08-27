import { Colors, Fonts } from "@/constants/constants";
import { KeyboardTypeOptions, TextInput, TextStyle } from "react-native";
import tw from "twrnc";

interface InputProps {
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  fontFamily?: string;
  onChangeText?: (text: string) => void;
  style?: TextStyle;
}

export const Input = ({
  fontFamily,
  keyboardType,
  maxLength,
  onChangeText,
  placeholder,
  style,
}: InputProps) => {
  return (
    <TextInput
      style={[
        { fontFamily: fontFamily || Fonts["Poppins-Bold"] },
        tw`bg-[${Colors.light3}] w-full h-10 rounded-[8px] pl-3 text-[16px] text-[${Colors.black}] font-bold `,
        style,
      ]}
      keyboardType={keyboardType}
      placeholder={placeholder}
      maxLength={maxLength}
      onChangeText={onChangeText}
    />
  );
};
