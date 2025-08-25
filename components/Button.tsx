import { Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import tw from "twrnc";
export const Button = ({
  text,
  style,
  textStyle,
  onClick,
  disabled,
}: {
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[tw`bg-[#d5ff5f] py-4 px-15 rounded-xl`, style]}
      onPress={onClick}
    >
      <Text style={[tw`text-[20px] font-bold`, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};
