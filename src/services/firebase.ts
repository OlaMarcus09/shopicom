import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseError, getApp, getApps, initializeApp } from 'firebase/app';
import {
  type Auth,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';

import { firebaseEnvironment } from '../config/firebase';

export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseEnvironment);

function createFirebaseAuth(): Auth {
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if (
      error instanceof FirebaseError &&
      error.code === 'auth/already-initialized'
    ) {
      return getAuth(firebaseApp);
    }

    throw error;
  }
}

export const firebaseAuth = createFirebaseAuth();
