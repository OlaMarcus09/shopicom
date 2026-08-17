import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { deleteLocalListing, type LocalListing } from './local-listing-service';
import { deleteCloudListing, getMyListings } from './listing-service';

export function MyListingsScreen({ onBack, onOpenListing }: { onBack: () => void; onOpenListing: (listing: LocalListing) => void }) {
  const [listings, setListings] = useState<LocalListing[]>([]);
  const { width } = useWindowDimensions();
  const cardWidth = (width - 42) / 2;

  useEffect(() => { getMyListings().then(setListings).catch(() => setListings([])); }, []);
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
    <View style={styles.header}><Pressable hitSlop={10} onPress={onBack}><Text style={styles.back}>‹</Text></Pressable><Text style={styles.title}>My Listings</Text><Text style={styles.count}>{listings.length}</Text></View>
    {listings.length ? <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
      {listings.map((listing) => <Pressable key={listing.id} onPress={() => onOpenListing(listing)} style={[styles.card, { width: cardWidth }]}>
        <Image resizeMode="cover" source={{ uri: listing.imageUrls[0] }} style={[styles.image, { width: cardWidth }]} />
        <View style={styles.cardCopy}><Text numberOfLines={1} style={styles.name}>{listing.title}</Text><Text style={styles.price}>GHS {listing.price}</Text><Text numberOfLines={1} style={styles.location}>⌖ {listing.location}</Text><View style={styles.actions}><Text style={styles.status}>ACTIVE</Text><Pressable hitSlop={8} onPress={(event) => { event.stopPropagation(); confirmDelete(listing); }}><Text style={styles.delete}>Delete</Text></Pressable></View></View>
      </Pressable>)}
    </ScrollView> : <View style={styles.empty}><Text style={styles.emptyTitle}>No listings yet</Text><Text style={styles.emptyCopy}>Products you post will appear here.</Text></View>}
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingHorizontal: 15 },
  back: { color: '#333', fontSize: 34, lineHeight: 36, marginRight: 10 },
  title: { flex: 1, color: '#171717', fontSize: 19, fontWeight: '700' },
  count: { minWidth: 28, color: '#F45100', fontSize: 12, fontWeight: '700', textAlign: 'center', backgroundColor: '#FFF0E8', borderRadius: 12, paddingVertical: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 11, paddingBottom: 30 },
  card: { overflow: 'hidden', borderWidth: 1, borderColor: '#EEE', borderRadius: 13, backgroundColor: '#FFF' },
  image: { height: 142, backgroundColor: '#F7F7F7' },
  cardCopy: { padding: 10 }, name: { color: '#222', fontSize: 13, fontWeight: '700' }, price: { color: '#F45100', fontSize: 14, fontWeight: '800', marginTop: 5 }, location: { color: '#777', fontSize: 10, marginTop: 5 }, actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 }, status: { color: '#17845D', fontSize: 8, fontWeight: '800', backgroundColor: '#EAF8F2', borderRadius: 5, paddingHorizontal: 6, paddingVertical: 3 }, delete: { color: '#D93025', fontSize: 10, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }, emptyTitle: { color: '#222', fontSize: 18, fontWeight: '700' }, emptyCopy: { color: '#777', fontSize: 13, marginTop: 7 },
});
