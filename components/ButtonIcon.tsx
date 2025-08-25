import { ReactNode } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import tw from "twrnc";
export const ButtonIcon = ({
  style,
  children,
  onClick,
}: {
  style?: ViewStyle;
  children: ReactNode;
  onClick: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[tw`bg-[#d5ff5f] py-4 px-15 rounded-xl`, style]}
      onPress={onClick}
    >
      {children}
    </TouchableOpacity>
  );
};
