import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseError, getApp, getApps, initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { type Auth, getAuth, initializeAuth } from 'firebase/auth';

import { firebaseEnvironment } from '../config/firebase';

// Firebase exposes this helper through its React Native runtime entrypoint,
// while the package's shared TypeScript declarations omit it.
const getReactNativePersistence = (
  FirebaseAuth as typeof FirebaseAuth & {
    getReactNativePersistence: (
      storage: typeof AsyncStorage,
    ) => import('firebase/auth').Persistence;
  }
).getReactNativePersistence;

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
