import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';

import { firebaseAuth, firebaseDb } from '../../services/firebase';

export type CloudChatMessage = { id: string; text: string; senderId: string; createdAt: Date | null };

function messagesCollection(userId: string) {
  return collection(firebaseDb, 'conversations', userId, 'messages');
}

export async function getCloudChatMessages(): Promise<CloudChatMessage[]> {
  const user = firebaseAuth.currentUser;
  if (!user) return [];
  const snapshot = await getDocs(query(messagesCollection(user.uid), orderBy('createdAt', 'asc')));
  return snapshot.docs.map((item) => ({ id: item.id, text: item.data().text, senderId: item.data().senderId, createdAt: item.data().createdAt?.toDate?.() ?? null }));
}

export async function saveCloudChatMessage(text: string) {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error('Sign in before sending a message.');
  await addDoc(messagesCollection(user.uid), { text, senderId: user.uid, participants: [user.uid], createdAt: serverTimestamp() });
}
