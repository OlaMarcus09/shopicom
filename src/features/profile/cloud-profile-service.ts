import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { firebaseDb } from '../../services/firebase';
import type { LocalProfile } from './local-profile-service';
import type { LocalVendorApplication } from './local-vendor-service';

export async function getCloudProfile(userId: string) {
  const snapshot = await getDoc(doc(firebaseDb, 'profiles', userId));
  return snapshot.exists() ? snapshot.data() as LocalProfile : null;
}

export async function saveCloudProfile(userId: string, profile: LocalProfile) {
  await setDoc(doc(firebaseDb, 'profiles', userId), { ...profile, updatedAt: serverTimestamp() }, { merge: true });
}

export async function saveCloudVendorApplication(userId: string, application: LocalVendorApplication) {
  await setDoc(doc(firebaseDb, 'vendorApplications', userId), { ...application, userId, updatedAt: serverTimestamp() }, { merge: true });
}
