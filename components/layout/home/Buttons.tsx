import { ButtonText } from "@/components/ui/ButtonText";
import { Colors, Fonts } from "@/constants/constants";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

export function Buttons({
  options,
  onClick,
  active,
}: {
  options: { label: string; value: string }[];
  onClick?: (key: string) => void;
  active?: boolean;
}) {
  return (
    <View style={tw`flex-15`}>
      <View style={tw`flex-1 items-center justify-center`}>
        <ButtonText
          text="Comencemos a cosechar"
          style={tw`w-90 items-center p-0 h-[88px] justify-center ${
            active ? `bg-[${Colors.light3}]` : ""
          }`}
          disabled={active}
          onClick={() => onClick?.("button_1")}
        />
      </View>
      <Text style={tw`text-[#d5d5d7] pl-5  text-[18px] `}>
        Tiempos de espera
      </Text>
      <View
        style={tw`flex-4 flex-wrap flex-row gap-3 justify-center  content-center`}
      >
        {options.map(({ label, value }) => (
          <TouchableOpacity
            style={tw`w-43 h-20 ${
              active
                ? `bg-[${Colors.black}] shadow-xl shadow-[${Colors.primary}]`
                : `bg-[${Colors.light3}]`
            } rounded-[8px] items-center justify-center p-3`}
            onPress={() => onClick?.(value)}
            disabled={!active}
            key={label}
          >
            <Text
              style={[
                tw`text-white text-[16px] text-center`,
                { fontFamily: Fonts["Lato-Bold"] },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={tw`flex-1 items-center justify-center mt-1`}>
        <ButtonText
          disabled={!active}
          text="Finalizar cosecha"
          style={tw`w-90 items-center p-0 h-[88px] justify-center ${
            !active ? `bg-[${Colors.light3}]` : ""
          }`}
          onClick={() => onClick?.("button_2")}
        />
      </View>
    </View>
  );
}
