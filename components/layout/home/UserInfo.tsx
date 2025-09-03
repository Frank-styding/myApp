import { Text, View } from "react-native";
import tw from "twrnc";

const InfoItem = ({ value, name }: { value: string; name: string }) => {
  return (
    <View style={tw`flex-row gap-2 `}>
      <Text style={tw`text-[17px] text-[#CACACA]`}>{name}</Text>
      <Text style={tw`text-[17px] text-white font-bold`}>{value}</Text>
    </View>
  );
};
export function UserInfo({ name, place }: { name: string; place: string }) {
  return (
    <View style={tw`w-50 gap-1 justify-center pb-2`}>
      <InfoItem value={name} name="Capitán" />
      <InfoItem value={`N° ${place}`} name="Fundo" />
    </View>
  );
}
