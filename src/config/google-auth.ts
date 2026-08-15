import { Platform } from 'react-native';

export const googleAuthClientIds = {
  android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

export const isGoogleAuthConfigured = Boolean(
  Platform.select({
    android: googleAuthClientIds.android,
    ios: googleAuthClientIds.ios,
    default: googleAuthClientIds.web,
  }),
);

// The provider hook requires platform client IDs during render. These inert
// values keep email auth usable until the real OAuth clients are configured.
export const googleAuthRequestClientIds = {
  androidClientId: googleAuthClientIds.android || 'google-android-client-not-configured',
  iosClientId: googleAuthClientIds.ios || 'google-ios-client-not-configured',
  webClientId: googleAuthClientIds.web || 'google-web-client-not-configured',
};
