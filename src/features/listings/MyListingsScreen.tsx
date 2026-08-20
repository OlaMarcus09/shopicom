import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { deleteLocalListing, type LocalListing } from './local-listing-service';
import { deleteCloudListing, getListingPerformance, getMyListings, updateListingStatus } from './listing-service';
import type { ListingPerformance } from './listing-types';

export function MyListingsScreen({ onBack, onOpenListing }: { onBack: () => void; onOpenListing: (listing: LocalListing) => void }) {
  const [listings, setListings] = useState<LocalListing[]>([]);
  const [performance, setPerformance] = useState<ListingPerformance>({ views: 0, favorites: 0, inquiries: 0 });
  const { width } = useWindowDimensions();
  const cardWidth = (width - 42) / 2;

  useEffect(() => {
    getMyListings().then(async (items) => {
      setListings(items);
      const cloudItems = items.filter((item) => item.cloudId);
      const metrics = await Promise.all(cloudItems.map((item) => getListingPerformance(item.cloudId!)));
      setPerformance(metrics.reduce((total, item) => ({ views: total.views + item.views, favorites: total.favorites + item.favorites, inquiries: total.inquiries + item.inquiries }), { views: 0, favorites: 0, inquiries: 0 }));
    }).catch(() => setListings([]));
  }, []);
  function confirmDelete(listing: LocalListing) {
    Alert.alert('Delete listing?', `Remove “${listing.title}” from your account and this device?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          if (listing.cloudId) {
            await deleteCloudListing(
              listing.cloudId,
              listing.cloudImageUrls || listing.imageUrls,
            );
          }
          await deleteLocalListing(listing.id);
          setListings((current) => current.filter((item) => item.id !== listing.id));
        } catch (error) {
          Alert.alert(
            'Unable to delete listing',
            error instanceof Error ? error.message : 'Please try again.',
          );
        }
      } },
    ]);
  }

  return <View style={styles.screen}>
    <View style={styles.header}><Pressable hitSlop={10} onPress={onBack}><Text style={styles.back}>‹</Text></Pressable><Text style={styles.title}>Vendor Dashboard</Text><Text style={styles.count}>{listings.length}</Text></View>
    <ScrollView contentContainerStyle={styles.dashboardContent} showsVerticalScrollIndicator={false}>
    <Text style={styles.sectionTitle}>Performance</Text>
    <View style={styles.metricsRow}>{[['Active', listings.filter((item) => item.status === 'active').length], ['Views', performance.views], ['Favorites', performance.favorites], ['Inquiries', performance.inquiries]].map(([label, value]) => <View key={String(label)} style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>)}</View>
    <Text style={styles.sectionTitle}>Your Listings</Text>
    {listings.length ? <View style={styles.grid}>
      {listings.map((listing) => <Pressable key={listing.id} onPress={() => onOpenListing(listing)} style={[styles.card, { width: cardWidth }]}>
        <Image resizeMode="cover" source={{ uri: listing.imageUrls[0] }} style={[styles.image, { width: cardWidth }]} />
        <View style={styles.cardCopy}><Text numberOfLines={1} style={styles.name}>{listing.title}</Text><Text style={styles.price}>GHS {listing.price}</Text><Text numberOfLines={1} style={styles.location}>⌖ {listing.location}</Text><View style={styles.actions}><Text style={[styles.status, listing.status === 'sold' && styles.soldStatus]}>{listing.status === 'sold' ? 'SOLD' : 'ACTIVE'}</Text><Pressable hitSlop={8} onPress={(event) => { event.stopPropagation(); confirmDelete(listing); }}><Text style={styles.delete}>Delete</Text></Pressable></View><Pressable disabled={!listing.cloudId} onPress={async (event) => { event.stopPropagation(); if (listing.cloudId) { const nextStatus = listing.status === 'sold' ? 'active' : 'sold'; await updateListingStatus(listing.cloudId, nextStatus); setListings((current) => current.map((item) => item.id === listing.id ? { ...item, status: nextStatus } : item)); } }}><Text style={styles.markSold}>{listing.status === 'sold' ? 'Mark active' : 'Mark sold'}</Text></Pressable></View>
      </Pressable>)}
    </View> : <View style={styles.empty}><Text style={styles.emptyTitle}>No listings yet</Text><Text style={styles.emptyCopy}>Products you post will appear here.</Text></View>}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingHorizontal: 15 },
  back: { color: '#333', fontSize: 34, lineHeight: 36, marginRight: 10 },
  title: { flex: 1, color: '#171717', fontSize: 19, fontWeight: '700' },
  count: { minWidth: 28, color: '#F45100', fontSize: 12, fontWeight: '700', textAlign: 'center', backgroundColor: '#FFF0E8', borderRadius: 12, paddingVertical: 5 },
  dashboardContent: { paddingBottom: 30 }, sectionTitle: { color: '#222', fontSize: 15, fontWeight: '800', paddingHorizontal: 14, paddingTop: 16, paddingBottom: 10 }, metricsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 11 }, metric: { flex: 1, minHeight: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#FFF5EF' }, metricValue: { color: '#F45100', fontSize: 20, fontWeight: '900' }, metricLabel: { color: '#777', fontSize: 10, marginTop: 4 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 11, paddingBottom: 30 },
  card: { overflow: 'hidden', borderWidth: 1, borderColor: '#EEE', borderRadius: 13, backgroundColor: '#FFF' },
  image: { height: 142, backgroundColor: '#F7F7F7' },
  cardCopy: { padding: 10 }, name: { color: '#222', fontSize: 13, fontWeight: '700' }, price: { color: '#F45100', fontSize: 14, fontWeight: '800', marginTop: 5 }, location: { color: '#777', fontSize: 10, marginTop: 5 }, actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 }, status: { color: '#17845D', fontSize: 8, fontWeight: '800', backgroundColor: '#EAF8F2', borderRadius: 5, paddingHorizontal: 6, paddingVertical: 3 }, soldStatus: { color: '#777', backgroundColor: '#F1F1F1' }, delete: { color: '#D93025', fontSize: 10, fontWeight: '700' }, markSold: { color: '#3C7EF0', fontSize: 10, fontWeight: '700', marginTop: 9 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }, emptyTitle: { color: '#222', fontSize: 18, fontWeight: '700' }, emptyCopy: { color: '#777', fontSize: 13, marginTop: 7 },
});
