import 'dotenv/config';

export default {
  expo: {
    name: 'Amity Social Cloud',
    slug: 'amity-social',
    version: '0.1.0',
    owner: 'amityexpo',
    orientation: 'portrait',
    icon: './src/assets/images/icon.png',
    scheme: 'amity-react-native-sample-app',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './src/assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'co.amity.react_native_sample_app',
    },
    web: {
      favicon: './src/assets/images/favicon.png',
    },
    extra: {
      apiKey: process.env.API_KEY,
    },
  },
};
