import { Fonts } from "@/constants/constants";
import { Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import tw from "twrnc";
interface ButtonProps {
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
  disabled?: boolean;
  fontFamily?: string;
}

export const ButtonText = ({
  text,
  style,
  textStyle,
  onPress,
  disabled,
  fontFamily,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        tw`bg-[#d5ff5f] py-4 px-10 rounded-[16px] items-center justify-center`,
        style,
        {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.8, // Opacidad alta (0.6 - 0.9)
          shadowRadius: 4,
          elevation: 10, // Elevation alto para Android
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          tw`text-[20px] font-bold`,
          { fontFamily: fontFamily || Fonts["Poppins-Bold"] },
          textStyle,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};
