import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { getLocalListings, type LocalListing } from './local-listing-service';

const products = [
  require('../../../assets/listings/product-card-smart-watch.png'),
  require('../../../assets/home/product-card-sneakers.png'),
  require('../../../assets/home/product-card-sneakers.png'),
  require('../../../assets/listings/product-card-smart-watch.png'),
  require('../../../assets/listings/product-card-smart-watch.png'),
  require('../../../assets/home/product-card-sneakers.png'),
];

export function HotSellingScreen({ onBack, onOpenProduct }: { onBack: () => void; onOpenProduct: (listing?: LocalListing) => void }) {
  const [localListings, setLocalListings] = useState<LocalListing[]>([]);
  const { width } = useWindowDimensions();
  const cardWidth = (width - 42) / 2;
  const cardHeight = cardWidth * (550 / 376);
  useEffect(() => { getLocalListings().then(setLocalListings).catch(() => setLocalListings([])); }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={onBack}><Text style={styles.back}>‹</Text></Pressable>
        <Text style={styles.title}>Hot Selling Products</Text>
        <Text style={styles.fire}>🔥</Text>
      </View>
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {localListings.map((listing) => (
          <Pressable key={listing.id} onPress={() => onOpenProduct(listing)} style={styles.cardButton}>
            <Image accessibilityLabel={`${listing.title} listing`} resizeMode="contain" source={{ uri: listing.imageUrls[0] }} style={{ width: cardWidth, height: cardHeight }} />
            <Text numberOfLines={1} style={styles.localTitle}>{listing.title}</Text>
            <Text style={styles.localPrice}>GHS {listing.price}</Text>
          </Pressable>
        ))}
        {products.map((source, index) => (
          <Pressable key={index} onPress={() => onOpenProduct()} style={styles.cardButton}>
            <Image resizeMode="contain" source={source} style={{ width: cardWidth, height: cardHeight }} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },
  header: { height: 62, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F2F2F2', paddingHorizontal: 14 },
  back: { color: '#333', fontSize: 35, lineHeight: 37, marginRight: 8 },
  title: { color: '#111', fontSize: 21, fontWeight: '800' },
  fire: { fontSize: 21, marginLeft: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 11, paddingTop: 16, paddingBottom: 30 },
  cardButton: { borderRadius: 16, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 5, elevation: 2 },
  localTitle: { color: '#222', fontSize: 12, fontWeight: '700', paddingHorizontal: 8, marginTop: 5 },
  localPrice: { color: '#F45100', fontSize: 13, fontWeight: '800', paddingHorizontal: 8, paddingBottom: 8, marginTop: 3 },
});
