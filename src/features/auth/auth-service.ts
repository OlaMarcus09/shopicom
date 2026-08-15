import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithCredential,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';

import { firebaseAuth } from '../../services/firebase';

export async function registerWithEmail(
  displayName: string,
  email: string,
  password: string,
) {
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email.trim(),
    password,
  );

  await updateProfile(credential.user, { displayName: displayName.trim() });

  return credential;
}

export function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
}

export function signInWithGoogleIdToken(idToken: string) {
  return signInWithCredential(
    firebaseAuth,
    GoogleAuthProvider.credential(idToken),
  );
}

export function signOutCurrentUser() {
  return signOut(firebaseAuth);
}

export function requestPasswordReset(email: string) {
  return sendPasswordResetEmail(firebaseAuth, email.trim());
}

export function subscribeToAuthSession(listener: (user: User | null) => void) {
  return onAuthStateChanged(firebaseAuth, listener);
}
