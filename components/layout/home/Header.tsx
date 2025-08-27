import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import tw from "twrnc";
import { UserInfo } from "./UserInfo";
export function Header({
  name,
  place,
  onSettings,
}: {
  name: string;
  place: string;
  onSettings?: () => void;
}) {
  return (
    <View
      style={tw`flex-3 justify-between flex-row items-center px-8 content-center pt-3`}
    >
      <UserInfo name={name} place={place} />
      <Ionicons
        name="settings-sharp"
        size={30}
        color={"white"}
        onPress={onSettings}
      />
    </View>
  );
}
