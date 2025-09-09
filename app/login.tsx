import { ErrorModal } from "@/components/modals/ErrorModal";
import { ButtonText } from "@/components/ui/ButtonText";
import { Input } from "@/components/ui/Input";
import { PlacePicker } from "@/components/ui/PlacePicker";
import {
  Colors,
  Fonts,
  RESET_TIME_CONFIG,
  SESSION_TIME,
} from "@/constants/constants";
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
import { ValidationModal } from "@/components/modals/ValidationModal";
import { isPastEndTime } from "@/lib/isPastSixThirty";
import { useConfigUpdater } from "@/hooks/useConfigUpdater";

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
    hasSession,
    startSession,
    isWorking,
    checkSession,
    endSession,
  } = useAppState();

  const [data, setData] = useState<{
    place?: string;
    name?: string;
    dni?: string;
    password?: string;
    error?: string;
  }>({});
  const [disabledLogin, setDisabledLogin] = useState(true);
  const [disabled, setDisabled] = useState(false);

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

  useConfigUpdater(hasConnection);

  /*   useEffect(() => {
    const updateConfigIfNeeded = async () => {
      if (!hasConnection) return;
      const { lastConfigUpdate, setLastConfigUpdate } = useAppState.getState();
      const now = Date.now();
      if (!lastConfigUpdate || now - lastConfigUpdate > RESET_TIME_CONFIG) {
        showModal("loading", "Actualizando Datos");
        try {
          const { config } = await getAppConfig();
          if (config) {
            useAppState.getState().setConfig(config);
            setLastConfigUpdate(now);
          }
        } catch (error) {
          console.error("Error cargando configuración:", error);
        } finally {
          hideModal("loading");
        }
      }
    };
    updateConfigIfNeeded();
    const interval = setInterval(updateConfigIfNeeded, RESET_TIME_CONFIG);
    return () => clearInterval(interval);
  }, []); */

  useEffect(() => {
    const init = async () => {
      if (
        dataState.dni &&
        dataState.password &&
        dataState.name &&
        dataState.place &&
        isWorking
      ) {
        goToHome();
        //router.replace("/home");
        return;
      }

      if (checkSession()) {
        if (
          dataState.dni &&
          dataState.name &&
          dataState.password &&
          dataState.place
        ) {
          setDisabledLogin(false);
          setDisabled(true);
          setData(dataState);
          return;
        }
      } else {
        setDisabled(false);
        setDisabledLogin(true);
        setData({});
      }
    };

    init();
  }, [hasConnection, setConfig, dataState]);

  useEffect(() => {
    setDisabledLogin(
      (data.dni?.length || 0) === 0 ||
        (data.name?.length || 0) === 0 ||
        (data.password?.length || 0) === 0 ||
        data.place === undefined
    );
  }, [data]);

  const onChangeUser = async (userId: string) => {
    if (!hasSession) {
      setData((prev) => ({ ...prev, dni: userId }));
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
      return;
    }

    /*  if (userId !== dataState.dni) {
      showModal(
        "validation",
        "Si cambia los datos se cerrar sesión",
        (confirm) => {
          if (confirm) {
            endSession();
            setData({ ...data, dni: userId });
          } else {
            setData({ ...dataState });
          }
        }
      );
    } */
  };

  const onChangePassword = (password: string) => {
    /*    if (password !== dataState.password && checkSession()) {
      showModal(
        "validation",
        "Si cambia los datos se cerrar sesión",
        (confirm) => {
          if (confirm) {
            endSession();
            setData({ ...data, password });
          } else {
            setData({ ...dataState });
          }
        }
      );
      return;
    } */

    setData({ ...data, password });
  };

  const onLogin = () => {
    if (!dni || !name || !place || !password) {
      showModal("error", "Por favor complete todos los campos");
      return;
    }
    if (dni.length < 8) {
      showModal("error", "El DNI debe tener 8 caracteres");
      return;
    }
    if (!hasSession) {
      showModal("loading", "Iniciando sesión");
      loginUser({ dni, password }).then(({ correct, alreadyLogged }) => {
        hideModal("loading");
        console.log(alreadyLogged);
        if (alreadyLogged) {
          showModal("error", "El usuario ya fue registrado");
          return;
        }
        if (correct) {
          setDataState(data);
          startSession(SESSION_TIME);
          goToHome();
          /*   router.replace("/home"); */
        } else {
          showModal("error", "La contraseña es incorrecta");
        }
      });
    } else {
      goToHome();
      /*  router.replace("/home"); */
    }
  };

  const goToHome = () => {
    /*     if (isPastEndTime()) {
      showModal("message", "Se termino la jornada");
      return;
    } */
    router.replace("/home");
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
          <View style={tw`flex-row gap-2 items-center`}>
            <Text
              style={[
                tw`text-white text-[18px] `,
                { fontFamily: Fonts["Lato-Bold"] },
              ]}
            >
              Bienvenido, Capitán
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
            disabled={disabled}
            onChangeText={onChangeUser}
          />
          <Input
            placeholder="Contraseña*"
            keyboardType="default"
            defaultValue={password}
            onChangeText={onChangePassword}
            disabled={disabled}
            secureTextEntry
          />
        </View>
        <View style={tw`gap-3`}>
          <Text
            style={[
              tw`text-white text-[18px] `,
              { fontFamily: Fonts["Lato-Bold"] },
            ]}
          >
            Selecciona fundo
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
          disabled={disabledLogin}
          onPress={onLogin}
        />
      </View>
      <Image
        source={require("@/assets/images/logo/logo2.png")}
        style={tw`absolute w-[51px] h-[31px] bottom-[80px] left-[50%] translate-x-[-25.5px] `}
      />
      <ErrorModal />
      <LoadingModal />
      <ValidationModal />
    </View>
  );
}
