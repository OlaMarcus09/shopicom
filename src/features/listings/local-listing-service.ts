import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from 'firebase/auth';

import type { CreateListingInput } from './listing-types';

const LOCAL_LISTINGS_KEY = '@shopicom/local-listings';

export type LocalListing = CreateListingInput & {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string | null;
  createdAt: string;
  status: 'active';
};

export async function saveLocalListing(input: CreateListingInput, user: User) {
  const existing = await getLocalListings();
  const listing: LocalListing = {
    ...input,
    id: `local-${Date.now()}`,
    sellerId: user.uid,
    sellerName: user.displayName?.trim() || 'Shopicom Seller',
    sellerEmail: user.email,
    createdAt: new Date().toISOString(),
    status: 'active',
  };

  await AsyncStorage.setItem(
    LOCAL_LISTINGS_KEY,
    JSON.stringify([listing, ...existing]),
  );

  return listing;
}

export async function getLocalListings(): Promise<LocalListing[]> {
  const stored = await AsyncStorage.getItem(LOCAL_LISTINGS_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as LocalListing[];
  } catch {
    return [];
  }
}
