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

import type { LocalListing } from '../listings/local-listing-service';
import { getCombinedListings } from '../listings/listing-service';
import { marketplaceFeatures, type MarketplaceFeature } from '../../config/marketplace-features';

const groups = [
  { label: 'Trending', icon: '✦', color: '#FFF0E8' },
  { label: 'Fashion', icon: '◈', color: '#F1ECFF' },
  { label: 'Mobile Phones', icon: '▣', color: '#E9F5FF' },
  { label: 'Smart Watches', icon: '◷', color: '#E9FFF5' },
  { label: 'Motorcycles', icon: '⌁', color: '#FFF7E5' },
  { label: 'Television', icon: '▤', color: '#F0F2FF' },
];

const allCategoryShortcuts: Array<{ label: string; feature: MarketplaceFeature }> = [
  { label: 'Products', feature: 'products' },
  { label: 'Services', feature: 'services' },
  { label: 'Fashion', feature: 'products' },
  { label: 'Phones & Tablets', feature: 'products' },
  { label: 'Electronics', feature: 'products' },
  { label: 'Laptops & Computers', feature: 'products' },
  { label: 'Home, Furniture & Appliances', feature: 'products' },
  { label: 'Beauty & Personal Care', feature: 'services' },
  { label: 'Health & Fitness', feature: 'services' },
  { label: 'Babies & Kids', feature: 'products' },
  { label: 'Food, Agric & Farming', feature: 'products' },
  { label: 'Sports & Entertainment', feature: 'products' },
  { label: 'Hotels', feature: 'hotels' },
  { label: 'Jobs', feature: 'jobs' },
  { label: 'Food', feature: 'food' },
  { label: 'Property', feature: 'property' },
];
const categories = allCategoryShortcuts.filter((item) => marketplaceFeatures[item.feature]);

export function CategoriesScreen({ initialCategory, onBack, onOpenListing, onOpenSearch }: { initialCategory?: string; onBack: () => void; onOpenListing: (listing: LocalListing) => void; onOpenSearch: () => void }) {
  const [selected, setSelected] = useState(() => categories.some((item) => item.label === initialCategory) ? (initialCategory || 'Recommend') : 'Recommend');
  const [listings, setListings] = useState<LocalListing[]>([]);
  const { width } = useWindowDimensions();
  const sidebarWidth = Math.min(116, width * 0.3);
  useEffect(() => { getCombinedListings().then(setListings).catch(() => setListings([])); }, []);
  const matches = useMemo(() => {
    if (selected === 'Recommend' || selected === 'Trending') return listings;
    const term = selected.toLowerCase().replace('mobile ', '').replace(' & tablets', '').replace('laptops & ', '');
    return listings.filter((listing) => [listing.category, listing.subCategory, listing.type, listing.title].some((value) => value?.toLowerCase().includes(term)));
  }, [listings, selected]);

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable hitSlop={10} onPress={onBack}><Text style={styles.back}>‹</Text></Pressable>
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
              <Pressable key={item.label} onPress={() => setSelected(item.label)} style={[styles.sideItem, selected === item.label && styles.sideItemActive]}>
                <Text style={[styles.sideText, selected === item.label && styles.sideTextActive]}>{item.label}</Text>
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
