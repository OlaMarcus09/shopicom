import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_KEY = '@shopicom/local-chat-messages';
export type LocalChatMessage = { id: string; text: string; createdAt: string };

export async function getLocalChatMessages(): Promise<LocalChatMessage[]> {
  const stored = await AsyncStorage.getItem(CHAT_KEY);
  if (!stored) return [];
  try { return JSON.parse(stored) as LocalChatMessage[]; } catch { return []; }
}

export async function saveLocalChatMessage(text: string) {
  const messages = await getLocalChatMessages();
  const message = { id: `message-${Date.now()}`, text, createdAt: new Date().toISOString() };
  await AsyncStorage.setItem(CHAT_KEY, JSON.stringify([...messages, message]));
  return message;
}
