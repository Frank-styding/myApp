import { Text, View } from "react-native";
import tw from "twrnc";

const InfoItem = ({
  value,
  name,
  textStyle,
  textStyle1,
}: {
  value: string;
  name: string;
  textStyle?: string;
  textStyle1?: string;
}) => {
  return (
    <View style={tw`flex-row gap-2 `}>
      <Text style={[tw`text-[17px] text-[#CACACA]`, tw`${textStyle as ""}`]}>
        {name}
      </Text>
      <Text
        style={[tw`text-[17px] text-white font-bold`, tw`${textStyle1 as ""}`]}
      >
        {value}
      </Text>
    </View>
  );
};
export function UserInfo({
  name,
  place,
  textStyle,
  textStyle1,
}: {
  name: string;
  place: string;
  textStyle?: string;
  textStyle1?: string;
}) {
  return (
    <View style={tw`w-50 gap-1 justify-center pb-2`}>
      <InfoItem
        value={name}
        name="Capitán"
        textStyle={textStyle}
        textStyle1={textStyle1}
      />
      <InfoItem
        value={`N° ${place}`}
        name="Fundo"
        textStyle={textStyle}
        textStyle1={textStyle1}
      />
    </View>
  );
}
