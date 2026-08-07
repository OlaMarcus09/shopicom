import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { firebaseAuth, firebaseStorage } from '../../services/firebase';

export async function uploadListingImages(imageUris: string[]) {
  const user = firebaseAuth.currentUser;

  if (!user) {
    throw new Error('You must be logged in to upload listing images.');
  }

  return Promise.all(
    imageUris.map(async (uri, index) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      const extension = blob.type.includes('png') ? 'png' : 'jpg';
      const storagePath = `listings/${user.uid}/${Date.now()}-${index}.${extension}`;
      const imageRef = ref(firebaseStorage, storagePath);

      await uploadBytes(imageRef, blob, {
        contentType: blob.type || `image/${extension === 'png' ? 'png' : 'jpeg'}`,
      });

      return getDownloadURL(imageRef);
    }),
  );
}
