import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';

import { firebaseAuth, firebaseDb } from '../../services/firebase';
import type { LocalListing } from '../listings/local-listing-service';

export type CloudChatMessage = { id: string; text: string; senderId: string; createdAt: Date | null };
export type CloudConversation = { id: string; listingId: string; listingTitle: string; sellerName: string; lastMessage: string; updatedAt: Date | null; participants: string[] };

function getConversationId(listing: LocalListing, currentUserId: string) {
  const buyerId = currentUserId === listing.sellerId ? 'seller-preview' : currentUserId;
  return `${listing.cloudId || listing.id}__${[buyerId, listing.sellerId].sort().join('__')}`.replace(/\//g, '_');
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

function mapMessage(item: { id: string; data: () => Record<string, any> }): CloudChatMessage {
  const data = item.data();
  return { id: item.id, text: data.text, senderId: data.senderId, createdAt: data.createdAt?.toDate?.() ?? null };
}

export function subscribeCloudChatMessages(listing: LocalListing | undefined, onMessages: (messages: CloudChatMessage[]) => void, onError?: () => void, existingConversationId?: string) {
  const user = firebaseAuth.currentUser;
  if (!user || !listing) return () => undefined;
  const conversationId = existingConversationId || getConversationId(listing, user.uid);
  return onSnapshot(query(messagesCollection(conversationId), orderBy('createdAt', 'asc')), (snapshot) => onMessages(snapshot.docs.map(mapMessage)), () => onError?.());
}

export function subscribeCloudConversations(onConversations: (conversations: CloudConversation[]) => void, onError?: () => void) {
  const user = firebaseAuth.currentUser;
  if (!user) return () => undefined;
  const conversationsCollection = collection(firebaseDb, 'conversations');
  return onSnapshot(query(conversationsCollection, where('participants', 'array-contains', user.uid)), (snapshot) => {
    const conversations = snapshot.docs.map((item) => {
      const data = item.data();
      return { id: item.id, listingId: data.listingId, listingTitle: data.listingTitle || 'Shopicom listing', sellerName: data.sellerName || 'Shopicom seller', lastMessage: data.lastMessage || '', updatedAt: data.updatedAt?.toDate?.() ?? null, participants: data.participants || [] };
    }).sort((first, second) => (second.updatedAt?.getTime() || 0) - (first.updatedAt?.getTime() || 0));
    onConversations(conversations);
  }, () => onError?.());
}

export async function saveCloudChatMessage(text: string, listing?: LocalListing, existingConversationId?: string) {
  const user = firebaseAuth.currentUser;
  if (!user || !listing) throw new Error('Open a listing before sending a message.');
  const conversationId = existingConversationId || getConversationId(listing, user.uid);
  const existingConversation = existingConversationId ? await getDoc(doc(firebaseDb, 'conversations', existingConversationId)) : null;
  const participants = existingConversation?.exists() ? existingConversation.data().participants as string[] : Array.from(new Set([user.uid, listing.sellerId]));
  await setDoc(doc(firebaseDb, 'conversations', conversationId), { participants, listingId: listing.cloudId || listing.id, listingTitle: listing.title, sellerName: listing.sellerName, lastMessage: text, updatedAt: serverTimestamp() }, { merge: true });
  await addDoc(messagesCollection(conversationId), { text, senderId: user.uid, createdAt: serverTimestamp() });
}
