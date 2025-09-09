import { Colors, Fonts } from "@/constants/constants";
import { normalize } from "@/lib/normalize";
import { ImageSourcePropType, View, Image, Text } from "react-native";
import tw from "twrnc";
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
      <View style={[tw`flex-4 items-center justify-center pt-40`]}>
        <Image source={source} />
      </View>
      <View style={tw`flex-1 items-center gap-4 justify-center`}>
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
            tw`text-[${normalize(18)}px] text-[${Colors.light0}] text-center`,
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
