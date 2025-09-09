import { View, Image, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { useState } from "react";
import { UserInfo } from "./UserInfo";

export function Header({
  name,
  place,
  image,
  textStyle,
  textStyle1,
  containerStyle,
}: {
  name: string;
  place: string;
  image?: string;
  textStyle?: string;
  textStyle1?: string;
  containerStyle?: string;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <View
      style={[
        tw`flex-4 justify-between flex-row items-end px-8 content-center`,
        tw`${containerStyle as ""}`,
      ]}
    >
      <UserInfo
        name={name}
        place={place}
        textStyle={textStyle}
        textStyle1={textStyle1}
      />

      <View
        style={tw`w-[70px] h-[70px] rounded-full overflow-hidden items-center justify-center `}
      >
        {image ? (
          <>
            <Image
              source={{ uri: image }}
              style={tw`w-[62px] h-[62px] rounded-full`}
              onLoadStart={() => {
                if (!image) {
                  setLoading(true);
                }
              }}
              onLoadEnd={() => {
                if (!image) {
                  setLoading(false);
                }
              }}
            />
          </>
        ) : (
          <Image
            source={require("@/assets/images/icons/account_icon.png")}
            style={tw`w-[62px] h-[62px] rounded-full`}
          />
        )}
      </View>
    </View>
  );
}
