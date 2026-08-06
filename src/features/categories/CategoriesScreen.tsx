import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const groups = [
  { label: 'Trending', icon: '✦', color: '#FFF0E8' },
  { label: 'Fashion', icon: '◈', color: '#F1ECFF' },
  { label: 'Mobile Phones', icon: '▣', color: '#E9F5FF' },
  { label: 'Smart Watches', icon: '◷', color: '#E9FFF5' },
  { label: 'Motorcycles', icon: '⌁', color: '#FFF7E5' },
  { label: 'Television', icon: '▤', color: '#F0F2FF' },
];

const categories = [
  'Fashion', 'Phones & Tablets', 'Electronics', 'Laptops & Computers',
  'Home, Furniture & Appliances', 'Beauty & Personal Care', 'Health & Fitness',
  'Babies & Kids', 'Food, Agric & Farming', 'Sports & Entertainment',
];

export function CategoriesScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.back}>‹</Text>
        <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><Text style={styles.searchText}>Search for anything</Text></View>
      </View>
      <View style={styles.body}>
        <ScrollView style={styles.side} showsVerticalScrollIndicator={false}>
          <Text style={styles.recommend}>Recommend</Text>
          {categories.map((item) => <Pressable key={item} style={styles.sideItem}><Text style={styles.sideText}>{item}</Text></Pressable>)}
        </ScrollView>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.contentHeader}><Text style={styles.title}>Recommend</Text><Text style={styles.viewAll}>View all</Text></View>
          <View style={styles.grid}>{groups.map((group) => <Pressable key={group.label} style={styles.tile}><View style={[styles.icon, { backgroundColor: group.color }]}><Text style={styles.iconText}>{group.icon}</Text></View><Text style={styles.tileLabel}>{group.label}</Text></Pressable>)}</View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },
  topBar: { height: 96, backgroundColor: '#F45100', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
  back: { color: '#FFF', fontSize: 48, lineHeight: 52, fontWeight: '300' },
  search: { flex: 1, height: 52, borderRadius: 15, backgroundColor: '#FF6F2D', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  searchIcon: { color: '#FFD2BE', fontSize: 32, marginRight: 10 },
  searchText: { color: '#FFD2BE', fontSize: 18, fontWeight: '600' },
  body: { flex: 1, flexDirection: 'row' },
  side: { width: '34%', backgroundColor: '#FAF9F9', paddingTop: 24 },
  recommend: { color: '#F45100', fontSize: 20, fontWeight: '800', paddingHorizontal: 16, marginBottom: 20 },
  sideItem: { paddingHorizontal: 16, paddingVertical: 15 },
  sideText: { color: '#6D6869', fontSize: 16, lineHeight: 21, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 24 },
  contentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { color: '#111', fontSize: 23, fontWeight: '800' },
  viewAll: { color: '#FF5A27', fontSize: 15, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 24 },
  tile: { width: '31%', alignItems: 'center' },
  icon: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  iconText: { color: '#F45100', fontSize: 30, fontWeight: '800' },
  tileLabel: { color: '#4C4647', fontSize: 13, lineHeight: 17, textAlign: 'center', fontWeight: '600' },
});
