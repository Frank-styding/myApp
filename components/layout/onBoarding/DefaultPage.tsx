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

export const DefaultPage = ({
  source,
  title,
  message,
}: {
  source: ImageSourcePropType;
  title: string;
  message: string;
}) => {
  return (
    <View style={tw`flex-1`}>
      <View style={[tw`flex-6 flex justify-center pt-25 items-center`]}>
        <Image
          source={source}
          style={{ width: height * 0.44, height: height * 0.44 }}
        />
      </View>
      <View style={tw`flex-1 items-center gap-4 justify-center px-3`}>
        <Text
          style={[
            tw`text-[${normalize(18)}px] text-[${Colors.primary}] text-center`,
            { fontFamily: Fonts["Poppins-Bold"] },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            tw`text-[${normalize(17)}px] text-[${Colors.light0}] text-center`,
            ,
            { fontFamily: Fonts["Lato-Regular"] },
          ]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
};
