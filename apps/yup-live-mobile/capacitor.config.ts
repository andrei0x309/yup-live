import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'gf.info.yup',
  appName: 'Yup Live Mobile',
  webDir: 'dist',
  android: {
    overrideUserAgent: 'Mozilla/5.0 (Linux; Android 12; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.5304.141 Mobile Safari/537.36'
  },
  server: {
    androidScheme: 'https',
    hostname: 'yup.info.gf'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 15000,
      launchAutoHide: false,
      backgroundColor: "#222",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#fff",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: false,
    },
    FirebaseMessaging: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      "smallIcon": "ic_stat_icon_config_sample",
      "iconColor": "#488AFF",
      "sound": "beep.wav"
    }
  },
};

export default config;
