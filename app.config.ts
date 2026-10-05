import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Expo config with Universal Links / App Links foundation.
 * Associated domains must be verified with AASA / assetlinks on ourmoment.app
 * before production install opens /m/{token} natively (Flow A).
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'OurMoment',
  slug: 'our-moment-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'ourmoment',
  userInterfaceStyle: 'light',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'app.ourmoment.mobile',
    associatedDomains: ['applinks:ourmoment.app', 'applinks:www.ourmoment.app'],
    infoPlist: {
      NSCameraUsageDescription:
        'OurMoment uses the camera to scan Moment QR codes and capture photos for your moments.',
      NSPhotoLibraryUsageDescription:
        'OurMoment needs photo access so you can add pictures to a moment.',
      NSPhotoLibraryAddUsageDescription:
        'OurMoment may save images when you export or share a moment.',
      // Allow LAN http:// during local development against Laravel.
      NSAppTransportSecurity: {
        NSAllowsLocalNetworking: true,
      },
    },
  },
  android: {
    package: 'app.ourmoment.mobile',
    // Required for http://LAN-IP:8000 during local API development.
    // ExpoConfig typings lag behind the Android manifest field Expo still applies.
    // @ts-expect-error usesCleartextTraffic is supported by Expo prebuild
    usesCleartextTraffic: true,
    adaptiveIcon: {
      backgroundColor: '#FFF5F0',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'ourmoment.app',
            pathPrefix: '/m/',
          },
          {
            scheme: 'https',
            host: 'www.ourmoment.app',
            pathPrefix: '/m/',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
    permissions: [
      'android.permission.CAMERA',
      'android.permission.READ_MEDIA_IMAGES',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-font',
    'expo-sharing',
    'expo-image',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#FFF5F0',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission:
          'Allow OurMoment to use the camera to scan Moment QR codes and take photos.',
        recordAudioAndroid: false,
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'Allow OurMoment to access your photos to build a moment.',
        cameraPermission:
          'Allow OurMoment to use the camera when adding photos to a moment.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api/v1',
    webOrigin: process.env.EXPO_PUBLIC_WEB_ORIGIN ?? 'https://ourmoment.app',
    assetOrigin: process.env.EXPO_PUBLIC_ASSET_ORIGIN,
    momentPathPrefix: '/m',
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
});
