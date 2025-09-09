import withBackgroundService from "./withBackgroundService";
export default {
  expo: {
    name: "EG Agroindustrial",
    slug: "app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    runtimeVersion: "1.0.0",
    owner: "egagroindustrial",
    updates: {
      url: "https://u.expo.dev/ea7ca90a-0d24-45d1-8011-942560391d5c",
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
      package: "com.ag.app",
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
        projectId: "ea7ca90a-0d24-45d1-8011-942560391d5c",
      },
    },
  },
};
