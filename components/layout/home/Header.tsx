/* import { Ionicons } from "@expo/vector-icons"; */
import { View, Image } from "react-native";
import tw from "twrnc";
import { UserInfo } from "./UserInfo";
export function Header({
  name,
  place,
  image,
  onSettings,
}: {
  name: string;
  place: string;
  image?: string;
  onSettings?: () => void;
}) {
  return (
    <View
      style={tw`flex-3 justify-between flex-row items-center px-8 content-center pt-3`}
    >
      <UserInfo name={name} place={place} />

      <View
        style={tw`w-[70px] h-[70px] rounded-full overflow-hidden items-center justify-center`}
      >
        {image && (
          <Image source={{ uri: image }} style={tw`w-[70px] h-[70px]`} />
        )}
      </View>
    </View>
  );
}
