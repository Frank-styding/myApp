import withBackgroundService from "./withBackgroundService";
export default {
  expo: {
    name: "EG Agroindustrial",
    slug: "myApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    runtimeVersion: "1.0.0",
    updates: {
      url: "https://u.expo.dev/b1e6bfac-c9dd-4331-b9c5-ce39bc39b728",
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 0,
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
      versionCode: 1,
      label: "EG Agroindustrial",
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
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      API_URL: process.env.API_URL,
      router: {},
      eas: {
        projectId: "b1e6bfac-c9dd-4331-b9c5-ce39bc39b728",
      },
      /*   jsEngine: "hermes", */
    },
  },
};
