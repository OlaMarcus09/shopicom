import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import type { LocalListing } from './local-listing-service';
import { getCombinedListings } from './listing-service';

export function SearchListingsScreen({ onBack, onOpenListing }: { onBack: () => void; onOpenListing: (listing: LocalListing) => void }) {
  const [query, setQuery] = useState('');
  const [listings, setListings] = useState<LocalListing[]>([]);
  useEffect(() => { getCombinedListings().then(setListings).catch(() => setListings([])); }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return listings;
    return listings.filter((listing) => [listing.title, listing.category, listing.subCategory, listing.location, listing.brand].some((value) => value?.toLowerCase().includes(term)));
  }, [listings, query]);

  return <View style={styles.screen}>
    <View style={styles.header}><Pressable hitSlop={10} onPress={onBack}><Text style={styles.back}>‹</Text></Pressable><View style={styles.search}><Text style={styles.icon}>⌕</Text><TextInput autoFocus onChangeText={setQuery} placeholder="Search products or location" placeholderTextColor="#888" style={styles.input} value={query} />{query ? <Pressable onPress={() => setQuery('')}><Text style={styles.clear}>×</Text></Pressable> : null}</View></View>
    <Text style={styles.resultCount}>{results.length} {results.length === 1 ? 'result' : 'results'}</Text>
    <ScrollView contentContainerStyle={styles.results} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      {results.map((listing) => <Pressable key={listing.id} onPress={() => onOpenListing(listing)} style={styles.card}><Image resizeMode="cover" source={{ uri: listing.imageUrls[0] }} style={styles.image} /><View style={styles.copy}><Text numberOfLines={1} style={styles.title}>{listing.title}</Text><Text style={styles.price}>GHS {listing.price}</Text><Text numberOfLines={1} style={styles.meta}>{listing.category} · {listing.location}</Text></View><Text style={styles.arrow}>›</Text></Pressable>)}
      {!results.length ? <View style={styles.empty}><Text style={styles.emptyTitle}>No matching listings</Text><Text style={styles.emptyCopy}>Try another product name, category, or location.</Text></View> : null}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' }, header: { height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#EEE' }, back: { color: '#333', fontSize: 34, lineHeight: 36, marginRight: 10 }, search: { flex: 1, height: 42, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DDD', borderRadius: 21, backgroundColor: '#FAFAFA', paddingHorizontal: 12 }, icon: { color: '#777', fontSize: 22, marginRight: 7 }, input: { flex: 1, color: '#222', fontSize: 14 }, clear: { color: '#777', fontSize: 24, paddingHorizontal: 4 }, resultCount: { color: '#777', fontSize: 12, paddingHorizontal: 16, paddingTop: 14 }, results: { padding: 14, paddingBottom: 30 }, card: { minHeight: 88, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingVertical: 10 }, image: { width: 72, height: 72, borderRadius: 10, backgroundColor: '#F7F7F7' }, copy: { flex: 1, marginLeft: 12 }, title: { color: '#222', fontSize: 14, fontWeight: '700' }, price: { color: '#F45100', fontSize: 14, fontWeight: '800', marginTop: 5 }, meta: { color: '#777', fontSize: 11, marginTop: 5 }, arrow: { color: '#AAA', fontSize: 28 }, empty: { alignItems: 'center', paddingTop: 90 }, emptyTitle: { color: '#222', fontSize: 17, fontWeight: '700' }, emptyCopy: { color: '#777', fontSize: 12, textAlign: 'center', marginTop: 7 },
});
