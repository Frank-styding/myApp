import { ButtonText } from "@/components/ui/ButtonText";
import { Colors, Fonts } from "@/constants/constants";
import { normalize } from "@/lib/normalize";
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
    <View style={tw`flex-21 mt-3`}>
      <View style={tw`flex-3  items-center justify-center`}>
        <ButtonText
          text="¡Comencemos a cosechar!"
          style={tw`w-[93%] items-center p-0 h-[88px] justify-center ${
            active ? `bg-[${Colors.light3}]` : ""
          }`}
          disabled={active}
          onPress={() => onClick?.("button_1")}
        />
      </View>
      <Text style={tw`text-white pl-5 py-1  text-[${normalize(18)}px] `}>
        Tiempos de espera
      </Text>
      <View style={tw`flex-9  pt-2 items-center`}>
        <View style={tw`flex-wrap flex-row gap-[15px] max-w-[93%]`}>
          {options.map(({ label, value }) => (
            <TouchableOpacity
              style={[
                tw`w-[177px] h-[80px] rounded-[16px] items-start justify-center p-3 pl-4 pr-10`,
                active
                  ? {
                      backgroundColor: Colors.black,
                      // Shadow iOS
                      shadowColor: Colors.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 1,
                      shadowRadius: 4,
                      elevation: 10,
                    }
                  : { backgroundColor: Colors.light3 },
              ]}
              onPress={() => onClick?.(value)}
              disabled={!active}
              key={label}
            >
              <Text
                style={[
                  tw`text-white text-[${normalize(16)}px] `,
                  { fontFamily: Fonts["Lato-Bold"] },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={tw`flex-4 items-center  pt-18`}>
        <ButtonText
          disabled={!active}
          text="¡Finalizar la cosecha!"
          style={tw`w-[93%] items-center p-0 h-[88px] justify-center ${
            !active ? `bg-[${Colors.light3}]` : ""
          }`}
          onPress={() => onClick?.("button_2")}
        />
      </View>
    </View>
  );
}
