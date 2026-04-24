import 'dotenv/config';

export default {
  expo: {
    name: 'pack-it',
    slug: 'pack-it',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'packit',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.rogerparis.packit',
      googleServicesFile: './GoogleService-Info.plist',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.rogerparis.packit',
      googleServicesFile: './google-services.json',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      '@react-native-firebase/app',
      '@react-native-firebase/auth',
      '@react-native-community/datetimepicker',
      'expo-router',
      './plugins/withFirebaseSwiftFix',
    ],
    extra: {
      OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      eas: {
        projectId: '88c4da5a-7194-4206-8b4c-abe0f4b7115d',
      },
    },
  },
};
