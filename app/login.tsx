import { ErrorModal } from "@/components/modals/ErrorModal";
import { ButtonText } from "@/components/ui/ButtonText";
import { Input } from "@/components/ui/Input";
import { Picker } from "@/components/ui/Picker";
import { Colors } from "@/constants/constants";
import { useModalContext } from "@/hooks/ModalProvider";
import { getAppConfig } from "@/lib/getAppConfig";
import { getUser } from "@/lib/getUser";
import { loginUser } from "@/lib/loginUser";
import { useAppState } from "@/store/store";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Image, Text, Modal, ActivityIndicator } from "react-native";
import tw from "twrnc";

export default function Login() {
  const [data, setData] = useState<{
    place?: string;
    name?: string;
    dni?: string;
    password?: string;
    error?: string;
  }>({});

  const { showModal } = useModalContext();
  const router = useRouter();
  const {
    setData: setDataState,
    data: dataState,
    config,
    setConfig,
  } = useAppState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dataState.dni && dataState.name && dataState.place) {
      router.replace("/home");
      return;
    }
    setIsLoading(true);
    getAppConfig().then(({ config }) => {
      if (config) {
        setConfig(config);
      }
      setIsLoading(false);
    });
  }, []);

  const onClick = () => {
    if (!data.dni || !data.name || !data.place || !data.password) {
      showModal("error", "Por favor complete todos los campos");
      return;
    }
    if (data.dni.length < 8) {
      showModal("error", "El DNI debe contar con 8 caracteres");
      return;
    }

    if (!data.dni && !data.name) {
      showModal("error", "El dni de usuario es incorrecto");
      return;
    }

    setIsLoading(true);
    loginUser({ dni: data.dni, password: data.password }).then(
      ({ correct }) => {
        setIsLoading(false);
        if (correct) {
          setDataState(data);
          router.replace("/home");
        } else {
          showModal("error", "La contraseña es incorrecta");
        }
      }
    );
  };

  const onChangeUser = (userId: string) => {
    if (userId.length === 8) {
      if (!data["dni"] || data["dni"] !== userId) {
        setIsLoading(true);
        getUser({ dni: userId }).then(({ name }) => {
          setIsLoading(false);
          if (name) {
            setData({ ...data, name, dni: userId });
          } else {
            showModal("error", "El usuario no fue encontrado");
          }
        });
      }
    }
    setData({ ...data, name: undefined, dni: userId });
  };

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-4 items-center justify-center`}>
        <Image
          source={require("../assets/images/logo/logo.png")}
          style={{ height: 195, width: 299 }}
        />
      </View>
      <View style={tw`flex-3 px-3 gap-4`}>
        <View style={tw`gap-3`}>
          <View style={tw`flex-row gap-2`}>
            <Text style={tw`text-white text-[20px] `}>Bienvenido capitán</Text>
            {data.name && (
              <Text style={tw`text-[${Colors.primary}] text-[20px] `}>
                {data.name}
              </Text>
            )}
          </View>
          <Input
            placeholder="Usuario"
            keyboardType="number-pad"
            maxLength={8}
            onChangeText={onChangeUser}
          />
          <Input
            placeholder="Contraseña*"
            keyboardType="default"
            onChangeText={(password) => setData({ ...data, password })}
          />
        </View>
        <View style={tw`gap-3`}>
          <Text style={tw`text-white text-[20px] `}>Selecione fundo</Text>
          <Picker
            placeholder="N° de fundo"
            value={data.place ? `N° ${data.place}` : ""}
            options={config.select_options}
            onSelect={(place) => setData({ ...data, place })}
          />
        </View>
      </View>
      <View style={tw`flex-3 items-center pt-10`}>
        <ButtonText text="Comencemos" onPress={onClick} />
      </View>

      <Modal transparent visible={isLoading} animationType="fade">
        <View
          style={tw`flex-1 items-center justify-center bg-[rgba(0,0,0,0.6)]`}
        >
          <ActivityIndicator size={"large"} color={Colors.primary} />
        </View>
      </Modal>
      <ErrorModal />
    </View>
  );
}
