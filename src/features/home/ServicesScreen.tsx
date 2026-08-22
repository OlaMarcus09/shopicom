import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { enabledMarketplaceSections } from '../../config/category-taxonomy';
import type { LocalListing } from '../listings/local-listing-service';
import { getCombinedListings } from '../listings/listing-service';
import { MarketplaceProductCard } from '../listings/MarketplaceProductCard';

const serviceCategories = enabledMarketplaceSections.find((section) => section.id === 'services')?.categories ?? [];

function FilterIcon() {
  return <View style={styles.filterIcon}><View style={styles.filterLine} /><View style={[styles.filterLine, styles.filterLineShort]} /><View style={[styles.filterLine, styles.filterLineTiny]} /></View>;
}

export function ServicesScreen({ onBack, onOpenListing }: { displayName?: string | null; onBack: () => void; onOpenListing: (listing: LocalListing) => void; onOpenSearch?: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For you');
  const [listings, setListings] = useState<LocalListing[]>([]);
  const { width } = useWindowDimensions();
  const cardWidth = Math.max(0, (width - 42) / 2);

  useEffect(() => {
    getCombinedListings()
      .then((items) => setListings(items.filter((item) => item.category && serviceCategories.some((category) => category.name === item.category))))
      .catch(() => setListings([]));
  }, []);

  const visibleListings = useMemo(() => {
    const term = query.trim().toLowerCase();
    return listings.filter((listing) => {
      const categoryMatch = selectedCategory === 'For you' || listing.category === selectedCategory;
      const queryMatch = !term || [listing.title, listing.category, listing.subCategory, listing.type, listing.location]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term));
      return categoryMatch && queryMatch;
    });
  }, [listings, query, selectedCategory]);

  return <View style={styles.screen}>
    <View style={styles.header}>
      <Pressable accessibilityLabel="Go back" accessibilityRole="button" hitSlop={10} onPress={onBack} style={styles.backButton}><Text style={styles.back}>‹</Text></Pressable>
      <Text style={styles.headerTitle}>Services</Text>
      <Pressable accessibilityLabel="Service filters" accessibilityRole="button" hitSlop={10} style={styles.filterButton}><FilterIcon /></Pressable>
    </View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><TextInput onChangeText={setQuery} placeholder="Search in Services..." placeholderTextColor="#888" style={styles.searchInput} value={query} /></View>
      <ScrollView contentContainerStyle={styles.categoryRow} horizontal showsHorizontalScrollIndicator={false}>
        {['For you', ...serviceCategories.map((category) => category.name)].map((category) => {
          const active = selectedCategory === category;
          return <Pressable key={category} onPress={() => setSelectedCategory(category)} style={[styles.categoryChip, active && styles.categoryChipActive]}><Text numberOfLines={1} style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>{active ? '✓  ' : ''}{category}</Text></Pressable>;
        })}
      </ScrollView>
      <Text style={styles.sectionTitle}>For you</Text>
      {visibleListings.length ? <View style={styles.grid}>{visibleListings.map((listing) => <MarketplaceProductCard key={listing.id} imageHeight={150} listing={listing} onPress={() => onOpenListing(listing)} rating={4.5} width={cardWidth} />)}</View> : <View style={styles.empty}><Text style={styles.emptyTitle}>No services yet</Text><Text style={styles.emptyCopy}>Services posted on Shopicom will appear here.</Text></View>}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },
  header: { height: 72, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F45100', paddingHorizontal: 16 },
  backButton: { width: 38, justifyContent: 'center' }, back: { color: '#FFF', fontSize: 38, lineHeight: 40 }, headerTitle: { flex: 1, color: '#FFF', fontSize: 23, fontWeight: '800' }, filterButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  filterIcon: { width: 24, gap: 5 }, filterLine: { height: 2, width: 24, backgroundColor: '#FFF', borderRadius: 2 }, filterLineShort: { width: 16 }, filterLineTiny: { width: 9 },
  content: { paddingHorizontal: 14, paddingTop: 20, paddingBottom: 112, backgroundColor: '#FFF' }, search: { height: 50, flexDirection: 'row', alignItems: 'center', borderRadius: 14, backgroundColor: '#F5F5F5', paddingHorizontal: 14 }, searchIcon: { color: '#666', fontSize: 27, marginRight: 9 }, searchInput: { flex: 1, color: '#222', fontSize: 16 }, categoryRow: { gap: 10, paddingTop: 24, paddingBottom: 22 }, categoryChip: { height: 40, maxWidth: 190, justifyContent: 'center', borderWidth: 1, borderColor: '#D8D8D8', borderRadius: 12, paddingHorizontal: 16, backgroundColor: '#FFF' }, categoryChipActive: { borderColor: '#F45100', backgroundColor: '#FFF0E9' }, categoryChipText: { color: '#555', fontSize: 13, fontWeight: '700' }, categoryChipTextActive: { color: '#F45100' }, sectionTitle: { color: '#222', fontSize: 20, fontWeight: '800', marginBottom: 14 }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 }, empty: { alignItems: 'center', paddingTop: 90, paddingHorizontal: 25 }, emptyTitle: { color: '#222', fontSize: 18, fontWeight: '800' }, emptyCopy: { color: '#777', fontSize: 13, textAlign: 'center', marginTop: 8 },
});
