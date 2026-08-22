import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  type StorageReference,
} from 'firebase/storage';

import { firebaseAuth, firebaseDb, firebaseStorage } from '../../services/firebase';
import type { CreateListingInput, ListingPerformance, ListingStatus, MarketplaceListing } from './listing-types';
import type { LocalListing } from './local-listing-service';
import { getLocalListings } from './local-listing-service';

const listingsCollection = collection(firebaseDb, 'listings');

type UploadProgress = {
  completed: number;
  total: number;
};

function imageExtension(uri: string) {
  const cleanUri = uri.split('?')[0];
  const match = cleanUri.match(/\.([a-zA-Z0-9]+)$/);
  return match?.[1]?.toLowerCase() || 'jpg';
}

async function uploadListingImages(
  userId: string,
  listingId: string,
  imageUris: string[],
  onProgress?: (progress: UploadProgress) => void,
  filePrefix = 'photo',
) {
  const uploadedReferences: StorageReference[] = [];
  const imageUrls: string[] = [];

  try {
    for (const [index, uri] of imageUris.entries()) {
      const response = await fetch(uri);
      const imageBlob = await response.blob();
      if (imageBlob.size === 0) {
        throw new Error(`Unable to read photo ${index + 1}.`);
      }
      const imageReference = ref(
        firebaseStorage,
        `listings/${userId}/${listingId}/${filePrefix}-${index + 1}.${imageExtension(uri)}`,
      );

      try {
        await uploadBytes(imageReference, imageBlob, {
          contentType: imageBlob.type || 'image/jpeg',
        });
      } finally {
        (imageBlob as Blob & { close?: () => void }).close?.();
      }

      uploadedReferences.push(imageReference);
      imageUrls.push(await getDownloadURL(imageReference));
      onProgress?.({ completed: index + 1, total: imageUris.length });
    }

    return imageUrls;
  } catch (error) {
    await Promise.allSettled(
      uploadedReferences.map((imageReference) => deleteObject(imageReference)),
    );
    throw error;
  }
}

export async function createListing(
  input: CreateListingInput,
  onProgress?: (progress: UploadProgress) => void,
) {
  const user = firebaseAuth.currentUser;

  if (!user) {
    throw new Error('You must be logged in to post a listing.');
  }

  const listingReference = doc(listingsCollection);
  const imageUrls = await uploadListingImages(
    user.uid,
    listingReference.id,
    input.imageUrls,
    onProgress,
  );
  const listingData = Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  );

  try {
    await setDoc(listingReference, {
      ...listingData,
      imageUrls,
      sellerId: user.uid,
      sellerName: user.displayName?.trim() || 'Shopicom Seller',
      sellerEmail: user.email,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    await Promise.allSettled(
      imageUrls.map((_, index) =>
        deleteObject(
          ref(
            firebaseStorage,
            `listings/${user.uid}/${listingReference.id}/photo-${index + 1}.${imageExtension(input.imageUrls[index])}`,
          ),
        ),
      ),
    );
    throw error;
  }

  return {
    id: listingReference.id,
    imageUrls,
  };
}

export async function getMyListings(): Promise<LocalListing[]> {
  const user = firebaseAuth.currentUser;
  if (!user) return [];

  const local = (await getLocalListings()).filter(
    (listing) => listing.sellerId === user.uid,
  );

  try {
    const snapshot = await getDocs(
      query(listingsCollection, where('sellerId', '==', user.uid)),
    );
    const cloud = snapshot.docs
      .map((document) => {
        const listing = document.data() as Omit<MarketplaceListing, 'id'>;
        return {
          ...listing,
          id: document.id,
          cloudId: document.id,
          cloudImageUrls: listing.imageUrls,
          createdAt:
            listing.createdAt?.toDate().toISOString() || new Date().toISOString(),
          status: listing.status,
        } satisfies LocalListing;
      })
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt));

    const cloudById = new Map(cloud.map((listing) => [listing.cloudId, listing]));
    const mergedLocal = local.map((listing) => {
      const cloudListing = listing.cloudId ? cloudById.get(listing.cloudId) : undefined;
      return cloudListing
        ? { ...listing, ...cloudListing, id: listing.id, imageUrls: listing.imageUrls }
        : listing;
    });
    const linkedCloudIds = new Set(mergedLocal.map((listing) => listing.cloudId).filter(Boolean));
    const localKeys = new Set(
      mergedLocal.map(
        (listing) => `${listing.sellerId}:${listing.title}:${listing.price}`,
      ),
    );
    const cloudOnly = cloud.filter(
      (listing) =>
        !linkedCloudIds.has(listing.cloudId) &&
        !localKeys.has(`${listing.sellerId}:${listing.title}:${listing.price}`),
    );

    return [...mergedLocal, ...cloudOnly];
  } catch {
    return local;
  }
}

function engagementDocument(listingId: string, collectionName: 'favorites' | 'inquiries' | 'views') {
  const user = firebaseAuth.currentUser;
  if (!user) return null;
  return doc(firebaseDb, 'listings', listingId, collectionName, user.uid);
}

export async function recordListingView(listingId?: string) {
  if (!listingId) return;
  const reference = engagementDocument(listingId, 'views');
  if (!reference) return;
  await setDoc(reference, { userId: firebaseAuth.currentUser?.uid, createdAt: serverTimestamp() });
}

export async function recordListingInquiry(listingId?: string) {
  if (!listingId) return;
  const reference = engagementDocument(listingId, 'inquiries');
  if (!reference) return;
  await setDoc(reference, { userId: firebaseAuth.currentUser?.uid, createdAt: serverTimestamp() });
}

export async function setCloudListingFavorite(listingId: string | undefined, favorite: boolean) {
  if (!listingId) return;
  const reference = engagementDocument(listingId, 'favorites');
  if (!reference) return;
  if (favorite) await setDoc(reference, { userId: firebaseAuth.currentUser?.uid, createdAt: serverTimestamp() });
  else await deleteDoc(reference);
}

export async function getListingPerformance(listingId: string): Promise<ListingPerformance> {
  const [views, favorites, inquiries] = await Promise.all([
    getCountFromServer(collection(firebaseDb, 'listings', listingId, 'views')),
    getCountFromServer(collection(firebaseDb, 'listings', listingId, 'favorites')),
    getCountFromServer(collection(firebaseDb, 'listings', listingId, 'inquiries')),
  ]);
  return {
    views: views.data().count,
    favorites: favorites.data().count,
    inquiries: inquiries.data().count,
  };
}

export async function updateListingStatus(listingId: string, status: ListingStatus) {
  await updateDoc(doc(listingsCollection, listingId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function updateCloudListing(listingId: string, updates: Partial<CreateListingInput>) {
  await updateDoc(doc(listingsCollection, listingId), {
    ...Object.fromEntries(Object.entries(updates).filter(([, value]) => value !== undefined)),
    updatedAt: serverTimestamp(),
  });
}

export async function updateCloudListingImages(listingId: string, retainedUrls: string[], newImageUris: string[]) {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error('Log in again before updating this listing.');
  const uploadedUrls = newImageUris.length ? await uploadListingImages(user.uid, listingId, newImageUris, undefined, `edit-${Date.now()}`) : [];
  const imageUrls = [...retainedUrls, ...uploadedUrls];
  await updateDoc(doc(listingsCollection, listingId), { imageUrls, updatedAt: serverTimestamp() });
  return imageUrls;
}

export async function deleteListingImages(imageUrls: string[]) {
  await Promise.allSettled(imageUrls.map((imageUrl) => deleteObject(ref(firebaseStorage, imageUrl))));
}

export async function deleteCloudListing(
  listingId: string,
  imageUrls: string[],
) {
  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error('Log in again before deleting this listing.');
  }

  await Promise.allSettled(
    imageUrls.map((imageUrl) => deleteObject(ref(firebaseStorage, imageUrl))),
  );
  await deleteDoc(doc(listingsCollection, listingId));
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

export async function getCombinedListings(maximum = 20): Promise<LocalListing[]> {
  const local = await getLocalListings();
  try {
    const cloud = await getLatestListings(maximum);
    const localCloudKeys = new Set(local.map((item) => `${item.sellerId}:${item.title}:${item.price}`));
    const cloudOnly = cloud.filter((item) => !localCloudKeys.has(`${item.sellerId}:${item.title}:${item.price}`)).map((item) => ({
      ...item,
      cloudId: item.id,
      cloudImageUrls: item.imageUrls,
      createdAt: item.createdAt?.toDate().toISOString() || new Date().toISOString(),
      status: 'active' as const,
    }));
    return [...local, ...cloudOnly];
  } catch {
    return local;
  }
}
