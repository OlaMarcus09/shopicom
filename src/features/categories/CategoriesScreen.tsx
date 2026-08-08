import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useEffect, useMemo, useState } from 'react';

import { getLocalListings, type LocalListing } from '../listings/local-listing-service';

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

export function CategoriesScreen({ initialCategory, onOpenListing, onOpenSearch }: { initialCategory?: string; onOpenListing: (listing: LocalListing) => void; onOpenSearch: () => void }) {
  const [selected, setSelected] = useState(initialCategory || 'Recommend');
  const [listings, setListings] = useState<LocalListing[]>([]);
  const { width } = useWindowDimensions();
  const sidebarWidth = Math.min(116, width * 0.3);
  useEffect(() => { getLocalListings().then(setListings).catch(() => setListings([])); }, []);
  const matches = useMemo(() => {
    if (selected === 'Recommend' || selected === 'Trending') return listings;
    const term = selected.toLowerCase().replace('mobile ', '').replace(' & tablets', '').replace('laptops & ', '');
    return listings.filter((listing) => [listing.category, listing.subCategory, listing.type, listing.title].some((value) => value?.toLowerCase().includes(term)));
  }, [listings, selected]);

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.back}>‹</Text>
        <Pressable onPress={onOpenSearch} style={styles.search}><Text style={styles.searchIcon}>⌕</Text><Text style={styles.searchText}>Search for anything</Text></Pressable>
      </View>
      <View style={styles.body}>
        <View style={[styles.side, { width: sidebarWidth }]}>
          <ScrollView
            contentContainerStyle={styles.sideContent}
            showsVerticalScrollIndicator={false}
          >
            <Pressable onPress={() => setSelected('Recommend')}><Text style={styles.recommend}>Recommend</Text></Pressable>
            {categories.map((item) => (
              <Pressable key={item} onPress={() => setSelected(item)} style={[styles.sideItem, selected === item && styles.sideItemActive]}>
                <Text style={[styles.sideText, selected === item && styles.sideTextActive]}>{item}</Text>
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
              <Text style={styles.title}>{selected}</Text>
              <Text style={styles.viewAll}>View all</Text>
            </View>
            {matches.length ? <View style={styles.productList}>{matches.map((listing) => <Pressable key={listing.id} onPress={() => onOpenListing(listing)} style={styles.productCard}><Image resizeMode="cover" source={{ uri: listing.imageUrls[0] }} style={styles.productImage} /><View style={styles.productCopy}><Text numberOfLines={1} style={styles.productName}>{listing.title}</Text><Text style={styles.productPrice}>GHS {listing.price}</Text><Text numberOfLines={1} style={styles.productLocation}>⌖ {listing.location}</Text></View></Pressable>)}</View> : <View style={styles.grid}>
              {groups.map((group) => (
                <Pressable key={group.label} onPress={() => setSelected(group.label)} style={styles.tile}>
                  <View style={[styles.icon, { backgroundColor: group.color }]}>
                    <Text style={styles.iconText}>{group.icon}</Text>
                  </View>
                  <Text numberOfLines={2} style={styles.tileLabel}>
                    {group.label}
                  </Text>
                </Pressable>
              ))}
            </View>}
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
  sideItemActive: { backgroundColor: '#FFF' },
  sideText: { color: '#6D6869', fontSize: 14, lineHeight: 19, fontWeight: '600' },
  sideTextActive: { color: '#F45100' },
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
  productList: { gap: 10 }, productCard: { flexDirection: 'row', borderWidth: 1, borderColor: '#EEE', borderRadius: 12, overflow: 'hidden' }, productImage: { width: 78, height: 82, backgroundColor: '#F7F7F7' }, productCopy: { flex: 1, justifyContent: 'center', paddingHorizontal: 10 }, productName: { color: '#222', fontSize: 13, fontWeight: '700' }, productPrice: { color: '#F45100', fontSize: 13, fontWeight: '800', marginTop: 5 }, productLocation: { color: '#777', fontSize: 10, marginTop: 5 },
});
