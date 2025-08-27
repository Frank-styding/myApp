import { ReactNode } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import tw from "twrnc";
export const Button = ({
  style,
  children,
  onClick,
  disabled,
}: {
  style?: ViewStyle;
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity
      style={[tw`bg-[#d5ff5f] py-4 px-15 rounded-xl`, style]}
      onPress={onClick}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
};
