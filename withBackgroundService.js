const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withBackgroundService(config) {
  return withAndroidManifest(config, (config) => {
    const service = {
      $: {
        "android:name": "com.asterinet.react.bgactions.RNBackgroundActionsTask",
        "android:foregroundServiceType": "dataSync",
        /* "android:enabled": "true", */
        "android:exported": "true",
      },
    };

    const app = config.modResults.manifest.application[0];

    if (!app.service) {
      app.service = [];
    }

    // Evitar duplicados
    if (
      !app.service.some(
        (s) =>
          s.$["android:name"] ===
          "com.asterinet.react.bgactions.RNBackgroundActionsTask"
      )
    ) {
      app.service.push(service);
    }

    return config;
  });
};
