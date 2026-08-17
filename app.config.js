const { expo } = require('./app.json');

const googleAndroidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const googleClientIdSuffix = '.apps.googleusercontent.com';
const googleRedirectScheme = googleAndroidClientId?.endsWith(googleClientIdSuffix)
  ? `com.googleusercontent.apps.${googleAndroidClientId.slice(
      0,
      -googleClientIdSuffix.length,
    )}`
  : null;

module.exports = {
  ...expo,
  scheme: googleRedirectScheme
    ? [expo.scheme, googleRedirectScheme]
    : expo.scheme,
  plugins: [...(expo.plugins ?? []), 'expo-web-browser'],
  android: {
    ...expo.android,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_FILE ??
      './.firebase/google-services.dev.json',
  },
};
