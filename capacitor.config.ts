import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.mastertasks',
  appName: 'MasterTasks',
  webDir: 'dist',
  bundledWebRuntime: false,
  
  plugins: {
    StatusBar: {
      style: 'LIGHT', // 'LIGHT' o 'DARK'
      overlaysWebView: false, // CRÍTICO: false para evitar superposición
      backgroundColor: '#ffffff', // Color de fondo del status bar
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
    }
  },
  
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'localhost'
  }
};

export default config;