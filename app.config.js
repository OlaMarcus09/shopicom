const { expo } = require('./app.json');

module.exports = {
  ...expo,
  plugins: [...(expo.plugins ?? []), 'expo-web-browser'],
  android: {
    ...expo.android,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_FILE ??
      './.firebase/google-services.dev.json',
  },
};
