import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const conversations = [
  { name: 'Sample Store', message: 'Hello', time: '11:47pm', image: require('../../../assets/home/product-card-sneakers.png'), initial: 'A', color: '#403A3A', verified: true },
  { name: 'Sample Store 2', message: 'Hi', time: '06:14pm', image: require('../../../assets/home/product-card-watch.png'), initial: 'D', color: '#FF3428', verified: false },
];

export function MessagesScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerRow}><Text style={styles.back}>‹</Text><Text style={styles.title}>Messages</Text><Text style={styles.bookmark}>▱</Text></View>
        <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><TextInput placeholder="Search by name..." placeholderTextColor="#FFD0BC" style={styles.searchInput} /></View>
      </View>
      <View style={styles.tabs}><Text style={[styles.tab, styles.activeTab]}>All</Text><Text style={styles.tab}>Unread</Text><Text style={styles.tab}>Spam</Text></View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {conversations.map((item) => <Pressable key={item.name} style={styles.conversation}><View><Image source={item.image} style={styles.avatarImage} /><View style={[styles.initial, { backgroundColor: item.color }]}><Text style={styles.initialText}>{item.initial}</Text></View></View><View style={styles.copy}><View style={styles.nameRow}><Text style={styles.name}>{item.name}</Text>{item.verified ? <Text style={styles.verified}>✓</Text> : null}</View><Text style={styles.message}>{item.message}</Text></View><Text style={styles.time}>{item.time}</Text></Pressable>)}
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
  tab: { alignSelf: 'stretch', paddingTop: 23, color: '#6B6B6B', fontSize: 18, fontWeight: '700', textAlign: 'center', width: '33%' },
  activeTab: { color: '#F45145', borderBottomWidth: 4, borderBottomColor: '#F45145' },
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
});
