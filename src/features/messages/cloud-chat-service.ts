import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';

import { firebaseAuth, firebaseDb } from '../../services/firebase';
import type { LocalListing } from '../listings/local-listing-service';

export type CloudChatMessage = { id: string; text: string; senderId: string; createdAt: Date | null };

function getConversationId(listing: LocalListing, currentUserId: string) {
  const buyerId = currentUserId === listing.sellerId ? 'seller-preview' : currentUserId;
  return `${listing.id}__${[buyerId, listing.sellerId].sort().join('__')}`.replace(/\//g, '_');
}

function messagesCollection(conversationId: string) {
  return collection(firebaseDb, 'conversations', conversationId, 'messages');
}

export async function getCloudChatMessages(listing?: LocalListing): Promise<CloudChatMessage[]> {
  const user = firebaseAuth.currentUser;
  if (!user || !listing) return [];
  const conversationId = getConversationId(listing, user.uid);
  const conversation = await getDoc(doc(firebaseDb, 'conversations', conversationId));
  if (!conversation.exists() || !(conversation.data().participants as string[]).includes(user.uid)) return [];
  const snapshot = await getDocs(query(messagesCollection(conversationId), orderBy('createdAt', 'asc')));
  return snapshot.docs.map((item) => ({ id: item.id, text: item.data().text, senderId: item.data().senderId, createdAt: item.data().createdAt?.toDate?.() ?? null }));
}

export async function saveCloudChatMessage(text: string, listing?: LocalListing) {
  const user = firebaseAuth.currentUser;
  if (!user || !listing) throw new Error('Open a listing before sending a message.');
  const conversationId = getConversationId(listing, user.uid);
  const participants = Array.from(new Set([user.uid, listing.sellerId]));
  await setDoc(doc(firebaseDb, 'conversations', conversationId), { participants, listingId: listing.id, listingTitle: listing.title, sellerName: listing.sellerName, lastMessage: text, updatedAt: serverTimestamp() }, { merge: true });
  await addDoc(messagesCollection(conversationId), { text, senderId: user.uid, createdAt: serverTimestamp() });
}
