import withBackgroundService from "./withBackgroundService";
export default {
  expo: {
    name: "myApp",
    slug: "myApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: ["background-processing"],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/appIcon/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.INTERNET",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.WAKE_LOCK",
        "android.permission.POST_NOTIFICATIONS",
        "android.permission.SCHEDULE_EXACT_ALARM",
        "android.permission.USE_EXACT_ALARM",
        "android.permission.FOREGROUND_SERVICE_DATA_SYNC",
      ],
      edgeToEdgeEnabled: true,
      package: "com.frank50pa1.myApp",
      versionCode: 1, // ← Número interno de versión
      label: "EG Agroindustrial", // ← NOMBRE QUE APARECE BAJO EL ICONO ← Esto es lo que buscas
      gradle: {
        buildOptions: {
          jvmArgs: ["-Xmx4g"],
        },
      },
    },
    plugins: [
      "expo-router",
      withBackgroundService,
      [
        "expo-splash-screen",
        {
          image: "./assets/images/appIcon/splash-icon.png",
          imageWidth: 84,
          resizeMode: "contain",
          backgroundColor: "#2D2D35",
        },
      ],
      /*       [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            buildToolsVersion: "34.0.0",
            enableProguardInReleaseBuilds: true,
          },
        },
      ], */
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      API_URL: process.env.API_URL,
      eas: {
        projectId: "cb01b46b-7902-4d7e-8399-538886449c25",
      },
      router: {},
      /*   jsEngine: "hermes", */
    },
  },
};
