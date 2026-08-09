import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getLocalChatMessages } from './local-chat-service';

type InboxTab = 'All' | 'Unread' | 'Spam';

export function MessagesScreen({ onBack, onOpenConversation }: { onBack: () => void; onOpenConversation: () => void }) {
  const [activeTab, setActiveTab] = useState<InboxTab>('All');
  const [query, setQuery] = useState('');
  const [hasMessages, setHasMessages] = useState(false);
  useEffect(() => { getLocalChatMessages().then((messages) => setHasMessages(messages.length > 0)).catch(() => setHasMessages(false)); }, []);
  const conversations = hasMessages ? [{ name: 'Shopicom seller', message: 'Local conversation', time: 'now', image: 0, initial: 'S', color: '#F45100', verified: false, unread: true, spam: false }] : [];
  const filteredConversations = useMemo(() => conversations.filter((item) => {
    const matchesTab = activeTab === 'All' || (activeTab === 'Unread' && item.unread) || (activeTab === 'Spam' && item.spam);
    const term = query.trim().toLowerCase();
    return matchesTab && (!term || item.name.toLowerCase().includes(term));
  }), [activeTab, query]);
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerRow}><Pressable hitSlop={10} onPress={onBack}><Text style={styles.back}>‹</Text></Pressable><Text style={styles.title}>Messages</Text><Text style={styles.bookmark}>▱</Text></View>
        <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><TextInput onChangeText={setQuery} placeholder="Search by name..." placeholderTextColor="#FFD0BC" style={styles.searchInput} value={query} /></View>
      </View>
      <View style={styles.tabs}>{(['All', 'Unread', 'Spam'] as InboxTab[]).map((tab) => <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabButton, activeTab === tab && styles.activeTab]}><Text style={[styles.tab, activeTab === tab && styles.activeTabText]}>{tab}</Text></Pressable>)}</View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filteredConversations.map((item) => <Pressable key={item.name} onPress={onOpenConversation} style={styles.conversation}><View><Image source={item.image} style={styles.avatarImage} /><View style={[styles.initial, { backgroundColor: item.color }]}><Text style={styles.initialText}>{item.initial}</Text></View></View><View style={styles.copy}><View style={styles.nameRow}><Text style={styles.name}>{item.name}</Text>{item.verified ? <Text style={styles.verified}>✓</Text> : null}</View><Text style={styles.message}>{item.message}</Text></View><Text style={styles.time}>{item.time}</Text></Pressable>)}
        {!filteredConversations.length ? <Text style={styles.empty}>No conversations found.</Text> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#F45100', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 18 },
  headerRow: { height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { color: '#FFF', fontSize: 34, lineHeight: 36 },
  title: { color: '#FFF', fontSize: 23, fontWeight: '800' },
  bookmark: { color: '#FFF', fontSize: 31, lineHeight: 33 },
  search: { height: 43, flexDirection: 'row', alignItems: 'center', borderRadius: 12, backgroundColor: '#FF6F2D', paddingHorizontal: 12 },
  searchIcon: { color: '#FFD0BC', fontSize: 27, marginRight: 8 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 15, paddingVertical: 0 },
  tabs: { height: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#F2F2F2' },
  tabButton: { alignSelf: 'stretch', justifyContent: 'center', width: '33%' }, tab: { color: '#6B6B6B', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  activeTab: { borderBottomWidth: 4, borderBottomColor: '#F45145' }, activeTabText: { color: '#F45145' },
  list: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 100 },
  conversation: { flexDirection: 'row', alignItems: 'center', minHeight: 86, marginBottom: 8 },
  avatarImage: { width: 58, height: 58, borderRadius: 12 },
  initial: { position: 'absolute', left: -4, bottom: -3, width: 35, height: 35, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF', borderRadius: 18 },
  initialText: { color: '#FFF', fontSize: 19, fontWeight: '600' },
  copy: { flex: 1, marginLeft: 15 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { color: '#111', fontSize: 17, fontWeight: '800' },
  verified: { color: '#FFF', backgroundColor: '#244AFF', borderRadius: 7, fontSize: 9, marginLeft: 4, paddingHorizontal: 3 },
  message: { color: '#333', fontSize: 14, marginTop: 7 },
  time: { color: '#333', fontSize: 12, alignSelf: 'center' },
  empty: { color: '#777', fontSize: 13, textAlign: 'center', paddingTop: 60 },
});
