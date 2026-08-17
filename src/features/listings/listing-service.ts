import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
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
import type { CreateListingInput, MarketplaceListing } from './listing-types';
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
        `listings/${userId}/${listingId}/photo-${index + 1}.${imageExtension(uri)}`,
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

  return listingReference;
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
      createdAt: item.createdAt?.toDate().toISOString() || new Date().toISOString(),
      status: 'active' as const,
    }));
    return [...local, ...cloudOnly];
  } catch {
    return local;
  }
}
