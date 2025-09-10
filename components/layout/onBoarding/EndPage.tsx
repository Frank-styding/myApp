import { ButtonText } from "@/components/ui/ButtonText";
import { Colors, Fonts } from "@/constants/constants";
import { normalize } from "@/lib/normalize";
import {
  ImageSourcePropType,
  View,
  Image,
  Text,
  Dimensions,
} from "react-native";
import tw from "twrnc";

const { height } = Dimensions.get("window");
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
    <View style={tw`flex-1 items-center justify-center`}>
      <View style={[tw`flex-6 flex justify-center pt-25 items-center`]}>
        <Image
          source={source}
          style={{ width: height * 0.44, height: height * 0.44 }}
        />
      </View>
      <View style={tw`flex-1 items-center gap-4 justify-center px-3`}>
        <Text
          selectable={false}
          style={[
            tw`text-[${normalize(18)}px] text-[${Colors.primary}] text-center`,
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
