import { ButtonText } from "@/components/ui/ButtonText";
import { Colors, Fonts } from "@/constants/constants";
import { ImageSourcePropType, View, Image, Text } from "react-native";
import tw from "twrnc";
export const EndPage = ({
  source,
  title,
  onFinishOnboarding,
}: {
  source: ImageSourcePropType;
  title: string;
  onFinishOnboarding?: () => void;
}) => {
  return (
    <View style={tw`flex-1`}>
      <View style={[tw`flex-4 items-center justify-center pt-40`]}>
        <Image source={source} />
      </View>
      <View style={tw`flex-1 items-center gap-4 justify-center`}>
        <Text
          style={[
            tw`text-[18px] text-[${Colors.primary}] text-center`,
            { fontFamily: Fonts["Poppins-Bold"] },
          ]}
        >
          {title}
        </Text>
        <ButtonText
          text="Ingresar"
          style={tw`w-[230px] h-[50px] p-0 bg-[${Colors.black2}]`}
          textStyle={tw`text-[${Colors.light0}]`}
          onPress={onFinishOnboarding}
        />
      </View>
    </View>
  );
};
