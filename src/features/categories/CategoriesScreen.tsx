import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

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
  const { width } = useWindowDimensions();
  const sidebarWidth = Math.min(116, width * 0.3);

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.back}>‹</Text>
        <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><Text style={styles.searchText}>Search for anything</Text></View>
      </View>
      <View style={styles.body}>
        <View style={[styles.side, { width: sidebarWidth }]}>
          <ScrollView
            contentContainerStyle={styles.sideContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.recommend}>Recommend</Text>
            {categories.map((item) => (
              <Pressable key={item} style={styles.sideItem}>
                <Text style={styles.sideText}>{item}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.contentPane}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentHeader}>
              <Text style={styles.title}>Recommend</Text>
              <Text style={styles.viewAll}>View all</Text>
            </View>
            <View style={styles.grid}>
              {groups.map((group) => (
                <Pressable key={group.label} style={styles.tile}>
                  <View style={[styles.icon, { backgroundColor: group.color }]}>
                    <Text style={styles.iconText}>{group.icon}</Text>
                  </View>
                  <Text numberOfLines={2} style={styles.tileLabel}>
                    {group.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
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
  body: { flex: 1, flexDirection: 'row', overflow: 'hidden' },
  side: { flexShrink: 0, backgroundColor: '#FAF9F9' },
  sideContent: { paddingTop: 20, paddingBottom: 100 },
  recommend: { color: '#F45100', fontSize: 15, fontWeight: '800', paddingHorizontal: 10, marginBottom: 14 },
  sideItem: { paddingHorizontal: 10, paddingVertical: 13 },
  sideText: { color: '#6D6869', fontSize: 14, lineHeight: 19, fontWeight: '600' },
  contentPane: { flex: 1, minWidth: 0, backgroundColor: '#FFF' },
  content: { paddingHorizontal: 12, paddingTop: 20, paddingBottom: 110 },
  contentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { color: '#111', fontSize: 20, fontWeight: '800' },
  viewAll: { color: '#FF5A27', fontSize: 13, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 22 },
  tile: { width: '31%', alignItems: 'center' },
  icon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 7 },
  iconText: { color: '#F45100', fontSize: 27, fontWeight: '800' },
  tileLabel: { color: '#4C4647', fontSize: 12, lineHeight: 15, textAlign: 'center', fontWeight: '600' },
});
