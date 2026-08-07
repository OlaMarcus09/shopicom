import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import { firebaseAuth, firebaseDb } from '../../services/firebase';
import type { CreateListingInput, MarketplaceListing } from './listing-types';

const listingsCollection = collection(firebaseDb, 'listings');

export async function createListing(input: CreateListingInput) {
  const user = firebaseAuth.currentUser;

  if (!user) {
    throw new Error('You must be logged in to post a listing.');
  }

  return addDoc(listingsCollection, {
    ...input,
    sellerId: user.uid,
    sellerName: user.displayName?.trim() || 'Shopicom Seller',
    sellerEmail: user.email,
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getLatestListings(maximum = 20) {
  const snapshot = await getDocs(
    query(
      listingsCollection,
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(maximum),
    ),
  );

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as MarketplaceListing[];
}
