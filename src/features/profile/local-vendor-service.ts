import AsyncStorage from '@react-native-async-storage/async-storage';

export type LocalVendorApplication = { businessName: string; category: string; location: string; phone: string; status: 'pending' };
const key = (userId: string) => `@shopicom/vendor-application/${userId}`;
export async function getVendorApplication(userId: string) { const stored = await AsyncStorage.getItem(key(userId)); if (!stored) return null; try { return JSON.parse(stored) as LocalVendorApplication; } catch { return null; } }
export async function saveVendorApplication(userId: string, application: LocalVendorApplication) { await AsyncStorage.setItem(key(userId), JSON.stringify(application)); }
