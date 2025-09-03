import { View, Image, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { useState } from "react";
import { UserInfo } from "./UserInfo";

export function Header({
  name,
  place,
  image,
}: {
  name: string;
  place: string;
  image?: string;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <View
      style={tw`flex-4 justify-between flex-row items-end px-8 content-center`}
    >
      <UserInfo name={name} place={place} />

      <View
        style={tw`w-[70px] h-[70px] rounded-full overflow-hidden items-center justify-center bg-gray-200`}
      >
        {image ? (
          <>
            <Image
              source={{ uri: image }}
              style={tw`w-[62px] h-[62px]`}
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
          <ActivityIndicator size="small" color="#000" />
        )}
      </View>
    </View>
  );
}
