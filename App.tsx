import { StatusBar } from 'expo-status-bar';

import { AuthPrototypeScreen } from './src/features/auth/AuthPrototypeScreen';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <AuthPrototypeScreen />
    </>
  );
}
