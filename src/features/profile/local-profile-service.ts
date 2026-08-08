import AsyncStorage from '@react-native-async-storage/async-storage';

export type LocalProfile = { displayName: string; location: string; bio: string };

function profileKey(userId: string) { return `@shopicom/profile/${userId}`; }

export async function getLocalProfile(userId: string): Promise<LocalProfile | null> {
  const stored = await AsyncStorage.getItem(profileKey(userId));
  if (!stored) return null;
  try { return JSON.parse(stored) as LocalProfile; } catch { return null; }
}

export async function saveLocalProfile(userId: string, profile: LocalProfile) {
  await AsyncStorage.setItem(profileKey(userId), JSON.stringify(profile));
}
