import { useState } from 'react';
import { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { getLocalChatMessages, saveLocalChatMessage, type LocalChatMessage } from './local-chat-service';

export function ChatScreen({ onBack, onViewItem }: { onBack: () => void; onViewItem: () => void }) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<LocalChatMessage[]>([]);
  useEffect(() => { getLocalChatMessages().then(setMessages).catch(() => setMessages([])); }, []);
  async function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    const message = await saveLocalChatMessage(text);
    setMessages((current) => [...current, message]);
    setDraft('');
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
      style={styles.screen}
    >
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Pressable hitSlop={10} onPress={onBack}><Text style={styles.back}>‹</Text></Pressable>
          <View style={styles.avatar}><Text style={styles.avatarText}>C</Text></View>
          <View style={styles.store}><Text style={styles.storeName}>Sample Store</Text><Text style={styles.online}>Online</Text></View>
          <Text style={styles.menu}>⋮</Text>
        </View>
        <View style={styles.regarding}><Text style={styles.regardingText}>Regarding: Men casual sneakers</Text><Pressable onPress={onViewItem} style={styles.viewItem}><Text style={styles.viewItemText}>View item</Text></Pressable></View>
      </View>

      <ScrollView contentContainerStyle={styles.chatBody} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.advice}><Text style={styles.warning}>!</Text><View style={styles.adviceCopy}><Text style={styles.adviceTitle}>SECURITY ADVICE</Text><Text style={styles.adviceText}>To avoid scams, do not pay in advance for delivery. Shopicom will not be responsible for any loss.</Text></View></View>
        <Text style={styles.day}>Yesterday</Text>
        <View style={styles.message}><Text style={styles.messageText}>Hello</Text><Text style={styles.messageTime}>11:47 pm ✓</Text></View>
        {messages.map((message) => <View key={message.id} style={styles.message}><Text style={styles.messageText}>{message.text}</Text><Text style={styles.messageTime}>Now ✓</Text></View>)}
      </ScrollView>

      <View style={styles.composer}><Text style={styles.emoji}>☺</Text><TextInput onChangeText={setDraft} onSubmitEditing={sendMessage} placeholder="Write a message" placeholderTextColor="#999" returnKeyType="send" style={styles.input} value={draft} />{draft.trim() ? <Pressable hitSlop={8} onPress={sendMessage}><Text style={styles.send}>➤</Text></Pressable> : <Text style={styles.camera}>▣</Text>}</View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#F45100', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 15 },
  topRow: { height: 62, flexDirection: 'row', alignItems: 'center' },
  back: { color: '#FFF', fontSize: 36, lineHeight: 38, marginRight: 10 },
  avatar: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FFF', borderRadius: 24, backgroundColor: '#403A3A' },
  avatarText: { color: '#FFF', fontSize: 25, fontWeight: '600' },
  store: { flex: 1, marginLeft: 12 },
  storeName: { color: '#FFF', fontSize: 19, fontWeight: '800' },
  online: { color: '#20ED48', fontSize: 13, fontWeight: '700', marginTop: 2 },
  menu: { color: '#FFF', fontSize: 29, lineHeight: 31 },
  regarding: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#FF9B72', borderRadius: 10, paddingHorizontal: 12, marginTop: 8 },
  regardingText: { flex: 1, color: '#FFF', fontSize: 14, fontWeight: '700' },
  viewItem: { borderRadius: 5, backgroundColor: '#FF864F', paddingHorizontal: 8, paddingVertical: 5 },
  viewItemText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  chatBody: { flex: 1, paddingHorizontal: 18, paddingTop: 22 },
  advice: { flexDirection: 'row', borderRadius: 18, backgroundColor: '#FFDCD7', paddingHorizontal: 15, paddingVertical: 13 },
  warning: { width: 29, height: 29, color: '#EF2D20', fontSize: 20, fontWeight: '900', textAlign: 'center', borderWidth: 2, borderColor: '#EF2D20', borderRadius: 15, marginRight: 11 },
  adviceCopy: { flex: 1 },
  adviceTitle: { color: '#EF2D20', fontSize: 15, fontWeight: '900', textAlign: 'center', marginBottom: 5 },
  adviceText: { color: '#EF2D20', fontSize: 13, lineHeight: 18, fontWeight: '700' },
  day: { alignSelf: 'center', color: '#777', fontSize: 12, backgroundColor: '#F3F3F3', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2, marginTop: 16 },
  message: { alignSelf: 'flex-end', minWidth: 88, borderRadius: 14, borderBottomRightRadius: 4, backgroundColor: '#F45100', paddingHorizontal: 12, paddingTop: 9, paddingBottom: 6, marginTop: 20 },
  messageText: { color: '#FFF', fontSize: 18 },
  messageTime: { color: '#FFF', fontSize: 10, textAlign: 'right', marginTop: 5 },
  composer: { height: 50, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D5D5D5', borderRadius: 25, marginHorizontal: 14, marginBottom: 12, paddingHorizontal: 14 },
  emoji: { color: '#7B7B7B', fontSize: 22 },
  input: { flex: 1, color: '#111', fontSize: 15, fontWeight: '600', paddingHorizontal: 12, paddingVertical: 0 },
  camera: { color: '#777', fontSize: 24 },
  send: { color: '#F45100', fontSize: 24 },
});
