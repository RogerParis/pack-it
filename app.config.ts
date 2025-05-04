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
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.rogerparis.packit',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['@react-native-firebase/app', '@react-native-firebase/auth'],
    extra: {
      OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
    },
  },
};
