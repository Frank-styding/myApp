import { ErrorModal } from "@/components/modals/ErrorModal";
import { ButtonText } from "@/components/ui/ButtonText";
import { Input } from "@/components/ui/Input";
import { PlacePicker } from "@/components/ui/PlacePicker";
import { Colors, Fonts } from "@/constants/constants";
import { useModalContext } from "@/hooks/ModalProvider";
import { getAppConfig } from "@/lib/getAppConfig";
import { getUser } from "@/lib/getUser";
import { loginUser } from "@/lib/loginUser";
import { useAppState } from "@/store/store";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { View, Image, Text, Alert } from "react-native";
import tw from "twrnc";
import { useBackgroundSync } from "@/hooks/useBackgroundSync";
import { useConnection } from "@/hooks/useConnection";
import { LoadingModal } from "@/components/modals/LoadingModal";

export default function Login() {
  const { hasConnection } = useConnection();
  const { showModal, hideModal } = useModalContext();
  const { checkPermissions, startBackgroundTask, isRunning } =
    useBackgroundSync();
  const router = useRouter();

  const {
    setData: setDataState,
    data: dataState,
    config,
    setConfig,
    hasSession: hasSeccion,
    startSession,
    isWorking,
    checkSession,
  } = useAppState();

  const [data, setData] = useState<{
    place?: string;
    name?: string;
    dni?: string;
    password?: string;
    error?: string;
  }>({});
  const [disabled, setDisabled] = useState(true);
  const hasInitialized = useRef(false);

  const { dni, name, place, password } = data;

  useEffect(() => {
    if (!hasConnection && !checkSession()) {
      showModal("error", "No tiene conexión a internet");
    }
  }, [hasConnection]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initPermissions = async () => {
      const granted = await checkPermissions();
      if (!granted) {
        Alert.alert(
          "Permisos necesarios",
          "Necesitas conceder permisos de notificaciones para sincronizar en segundo plano."
        );
      } else {
        if (!isRunning) {
          startBackgroundTask();
        }
      }
    };

    initPermissions();
  }, []);

  useEffect(() => {
    const FIVE_HOURS = 5 * 60 * 60 * 1000;

    const updateConfigIfNeeded = async () => {
      const { lastConfigUpdate } = useAppState.getState();
      const now = Date.now();

      if (!lastConfigUpdate || now - lastConfigUpdate > FIVE_HOURS) {
        showModal("loading", "Actualizando Datos");
        try {
          const { config } = await getAppConfig();
          if (config) {
            useAppState.getState().setConfig(config);
          }
        } catch (error) {
          console.error("Error cargando configuración:", error);
        } finally {
          hideModal("loading");
        }
      }
    };

    updateConfigIfNeeded();

    const interval = setInterval(updateConfigIfNeeded, FIVE_HOURS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: number;

    const init = async () => {
      if (dataState.dni && dataState.name && dataState.place && isWorking) {
        router.replace("/home");
        return;
      }

      if (
        dataState.dni &&
        dataState.name &&
        dataState.place &&
        checkSession()
      ) {
        setDisabled(false);
        setData(dataState);
        return;
      } else {
        setData({});
      }
    };

    init();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hasConnection, setConfig, dataState]);

  useEffect(() => {
    setDisabled(
      (data.dni?.length || 0) === 0 ||
        (data.name?.length || 0) === 0 ||
        (data.password?.length || 0) === 0
    );
  }, [data]);

  const onClick = () => {
    if (!dni || !name || !place || !password) {
      showModal("error", "Por favor complete todos los campos");
      return;
    }
    if (dni.length < 8) {
      showModal("error", "El DNI debe tener 8 caracteres");
      return;
    }
    if (!hasSeccion) {
      showModal("loading", "Iniciando seccion");
      loginUser({ dni, password }).then(({ correct }) => {
        hideModal("loading");
        if (correct) {
          const sessionDurationMs = 60 * 60 * 1000; //! revisar de donde obtener este niumero
          setDataState(data);
          startSession(sessionDurationMs);
          router.replace("/home");
        } else {
          showModal("error", "La contraseña es incorrecta");
        }
      });
    } else {
      router.replace("/home");
    }
  };

  const onChangeUser = async (userId: string) => {
    setData((prev) => ({ ...prev, dni: userId }));
    if (!hasSeccion) {
      if (userId.length < 8) return;
      showModal("loading", "Buscando usuario");
      try {
        const { name } = await getUser({ dni: userId });
        if (name) {
          setData((prev) => ({ ...prev, dni: userId, name }));
        } else {
          showModal("error", "El usuario no fue encontrado");
        }
      } finally {
        hideModal("loading");
      }
    }
  };

  return (
    <View style={tw`flex-1 pb-18`}>
      <View style={tw`flex-6 items-center justify-center`}>
        <Image
          source={require("../assets/images/logo/logo.png")}
          style={{ height: 195, width: 299 }}
        />
      </View>
      <View style={tw`flex-3 px-3 gap-4`}>
        <View style={tw`gap-3`}>
          <View style={tw`flex-row gap-2`}>
            <Text
              style={[
                tw`text-white text-[18px] `,
                { fontFamily: Fonts["Poppins-Bold"] },
              ]}
            >
              Bienvenido capitán
            </Text>
            {name && (
              <Text style={tw`text-[${Colors.primary}] text-[20px] `}>
                {name}
              </Text>
            )}
          </View>
          <Input
            placeholder="Usuario"
            keyboardType="number-pad"
            maxLength={8}
            defaultValue={dni}
            onChangeText={onChangeUser}
          />
          <Input
            placeholder="Contraseña*"
            keyboardType="default"
            defaultValue={password}
            onChangeText={(password) => setData({ ...data, password })}
            secureTextEntry
          />
        </View>
        <View style={tw`gap-3`}>
          <Text
            style={[
              tw`text-white text-[18px] `,
              { fontFamily: Fonts["Poppins-Bold"] },
            ]}
          >
            Selecione fundo
          </Text>
          <PlacePicker
            placeholder="N° de fundo"
            value={place ? `Fundo N° ${place}` : ""}
            options={config.select_options}
            onSelect={(place) => setData({ ...data, place })}
          />
        </View>
      </View>
      <View style={tw`flex-3 items-center justify-center pt-10`}>
        <ButtonText
          text="Comencemos"
          style={tw`w-[209px] h-[52px] p-0 items-center justify-center`}
          disabled={disabled}
          onPress={onClick}
        />
      </View>
      <Image
        source={require("@/assets/images/logo/logo2.png")}
        style={tw`absolute w-[51px] h-[31px] bottom-[80px] left-[50%] translate-x-[-25.5px] `}
      />
      <ErrorModal />
      <LoadingModal />
    </View>
  );
}
