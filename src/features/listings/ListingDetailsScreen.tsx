import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { LocalListing } from './local-listing-service';

export function ListingDetailsScreen({ onBack, onChat, onOpenVendor, listing }: { onBack: () => void; onChat: () => void; onOpenVendor: () => void; listing?: LocalListing }) {
  const imageSource = listing?.imageUrls[0] ? { uri: listing.imageUrls[0] } : require('../../../assets/listings/smart-watch-orange.png');
  const imageSources = listing?.imageUrls.length ? listing.imageUrls.map((uri) => ({ uri })) : [imageSource];
  const [activeImage, setActiveImage] = useState(0);
  const { width } = useWindowDimensions();
  const specifications = listing ? [
    ['Type', listing.type || listing.subCategory],
    ...(listing.brand ? [['Brand', listing.brand] as [string, string]] : []),
    ['Category', listing.category],
    ['Condition', listing.condition],
    ['Location', listing.location],
  ] : [
    ['Type', 'Refrigerators'], ['Brand', 'Nasco'], ['Condition', 'Brand New'],
    ['Color', 'Silver'], ['Power Source', 'Electric'], ['Energy Class', 'A++'],
    ['Number of Doors', '2'], ['Material', 'Metals'],
  ];
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topActions}><Pressable onPress={onBack}><Text style={styles.action}>‹</Text></Pressable><View style={styles.actionRow}><Text style={styles.share}>⌯</Text><Text style={styles.heart}>♡</Text></View></View>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(event) => setActiveImage(Math.round(event.nativeEvent.contentOffset.x / width))}>
          {imageSources.map((source, index) => <Image key={index} resizeMode="contain" source={source} style={[styles.hero, { width }]} />)}
        </ScrollView>
        <View style={styles.counter}><Text style={styles.counterText}>{activeImage + 1}/{imageSources.length}</Text></View>

        <View style={styles.section}>
          <Text style={styles.title}>{listing?.title || 'Ultra smart watch'}</Text>
          <View style={styles.badges}><Text style={styles.storeBadge}>PHYSICAL STORE</Text><Text style={styles.verifiedBadge}>VERIFIED</Text></View>
          <View style={styles.priceRow}><Text style={styles.price}>GHS {listing?.price ?? 200}</Text>{listing?.discount ? <Text style={styles.discount}>-{listing.discount}%</Text> : <><Text style={styles.oldPrice}>GHS 250</Text><Text style={styles.discount}>-25%</Text></>}</View>
          <Text style={styles.location}>⌖  {listing?.location || 'Banvum Tamale'}</Text>
          <Text style={styles.rating}>★★★★★  <Text style={styles.ratingCopy}>0.0   (0 reviews)</Text></Text>
          <View style={styles.contactRow}><Pressable style={styles.call}><Text style={styles.contactText}>☎  Call</Text></Pressable><Pressable onPress={onChat} style={styles.message}><Text style={styles.contactText}>◯  Message</Text></Pressable></View>
        </View>

        <View style={styles.section}>
          <View style={styles.specGrid}>{specifications.map(([label, value]) => <View key={label} style={styles.spec}><Text style={styles.specValue}>{value}</Text><Text style={styles.specLabel}>{label}</Text></View>)}</View>
          <Text style={styles.heading}>Description</Text>
          <Text style={styles.description}>{listing?.description || 'The Nasco NASF2-10FL 76 Liter Table Top Fridge gives you the extra storage you need for food and beverages. Its compact size complements most spaces smoothly.'}</Text>
          <Text style={styles.heading}>Select Delivery Method</Text>
          <View style={styles.deliveryRow}>{listing?.deliveryOptions.includes('in_store_pickup') || !listing ? <View style={styles.delivery}><Text style={styles.deliveryIcon}>▣</Text><View><Text style={styles.deliveryTitle}>In-store Pickup</Text><Text style={styles.deliveryCopy}>Available Now</Text></View></View> : null}{listing?.deliveryOptions.includes('local_delivery') || !listing ? <View style={styles.delivery}><Text style={styles.deliveryIcon}>▤</Text><View><Text style={styles.deliveryTitle}>Local Delivery</Text><Text style={styles.deliveryCopy}>Delivery fee may apply</Text></View></View> : null}</View>
        </View>

        <Pressable onPress={onOpenVendor} style={styles.vendor}><View style={styles.vendorAvatar}><Text style={styles.vendorInitial}>{(listing?.sellerName || 'S').charAt(0).toUpperCase()}</Text></View><View style={styles.vendorCopy}><Text style={styles.vendorName}>{listing?.sellerName || 'Sample Store'}</Text><Text style={styles.vendorMeta}>⌖ {listing?.location || 'Banvum, Tamale'}</Text><Text style={styles.vendorMeta}>{listing ? 'Local listing' : 'Recently joined'}</Text></View><View><Text style={styles.viewAds}>View Ads (0)</Text><Text style={styles.active}>Active now</Text></View></Pressable>

        <View style={styles.section}><View style={styles.reviewHeader}><Text style={styles.heading}>Product reviews</Text><Text style={styles.writeReview}>Write a review +</Text></View><View style={styles.review}><View style={styles.reviewer}><Text style={styles.reviewerInitial}>D</Text><Text style={styles.reviewerName}>Dizzy</Text><Text style={styles.reviewTime}>12 hr ago</Text></View><Text style={styles.stars}>★★★★☆</Text><Text style={styles.reviewText}>The product gives you the extra storage you need for food and beverages. The compact design fits smoothly into small spaces.</Text></View></View>
      </ScrollView>
      <View style={styles.bottom}><Pressable onPress={onChat} style={styles.chatButton}><Text style={styles.chatText}>◯  Chat with Vendor</Text></Pressable><Pressable style={styles.shareButton}><Text style={styles.shareBottom}>⌯</Text></Pressable></View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },
  content: { paddingBottom: 88 },
  topActions: { height: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  action: { color: '#333', fontSize: 34 },
  actionRow: { flexDirection: 'row', gap: 20 }, share: { fontSize: 23 }, heart: { fontSize: 29 },
  hero: { width: '100%', height: 250, backgroundColor: '#FAFAFA' },
  counter: { alignSelf: 'flex-end', borderRadius: 8, backgroundColor: '#333', paddingHorizontal: 7, paddingVertical: 3, marginRight: 17, marginTop: -32, marginBottom: 15 },
  counterText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  section: { paddingHorizontal: 16, paddingVertical: 18, borderTopWidth: 8, borderTopColor: '#F7F7F7' },
  title: { color: '#111', fontSize: 20, fontWeight: '800' },
  badges: { flexDirection: 'row', gap: 7, marginTop: 12 },
  storeBadge: { color: '#4465D8', fontSize: 10, fontWeight: '800', backgroundColor: '#E8EEFF', borderRadius: 7, padding: 6 },
  verifiedBadge: { color: '#308B6D', fontSize: 10, fontWeight: '800', backgroundColor: '#E8F8F2', borderRadius: 7, padding: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 12 },
  price: { color: '#111', fontSize: 21, fontWeight: '900' }, oldPrice: { color: '#999', fontSize: 13, textDecorationLine: 'line-through' }, discount: { color: '#F22', fontSize: 13, fontWeight: '800' },
  location: { color: '#666', fontSize: 13, fontWeight: '600', marginTop: 10 },
  rating: { color: '#FFC400', fontSize: 14, marginTop: 10 }, ratingCopy: { color: '#777', fontWeight: '600' },
  contactRow: { flexDirection: 'row', gap: 9, marginTop: 18 },
  call: { flex: 1, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#13BE84' },
  message: { flex: 1, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#3C7EF0' }, contactText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  specGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 18 }, spec: { width: '50%' }, specValue: { color: '#222', fontSize: 15, fontWeight: '800' }, specLabel: { color: '#777', fontSize: 12, fontWeight: '600', marginTop: 3 },
  heading: { color: '#222', fontSize: 15, fontWeight: '800', marginTop: 22, marginBottom: 8 }, description: { color: '#666', fontSize: 12, lineHeight: 17 },
  deliveryRow: { flexDirection: 'row', gap: 10 }, delivery: { flex: 1, minHeight: 58, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#16C587', borderRadius: 8, padding: 9 }, deliveryIcon: { color: '#16C587', fontSize: 20, marginRight: 7 }, deliveryTitle: { color: '#222', fontSize: 12, fontWeight: '800' }, deliveryCopy: { color: '#555', fontSize: 9, marginTop: 2 },
  vendor: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 14, borderRadius: 14, backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 7 }, vendorAvatar: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 23, backgroundColor: '#F45100' }, vendorInitial: { color: '#FFF', fontSize: 21, fontWeight: '800' }, vendorCopy: { flex: 1, marginLeft: 11 }, vendorName: { fontSize: 14, fontWeight: '800' }, vendorMeta: { color: '#777', fontSize: 10, marginTop: 3 }, viewAds: { color: '#F45100', fontSize: 10, fontWeight: '800' }, active: { color: '#16A269', fontSize: 9, marginTop: 3 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, writeReview: { color: '#F45100', fontSize: 10, fontWeight: '700' }, review: { borderRadius: 9, backgroundColor: '#FAFAFA', padding: 12 }, reviewer: { flexDirection: 'row', alignItems: 'center' }, reviewerInitial: { color: '#FFF', backgroundColor: '#555', borderRadius: 15, paddingHorizontal: 9, paddingVertical: 5 }, reviewerName: { flex: 1, fontSize: 13, fontWeight: '800', marginLeft: 8 }, reviewTime: { color: '#555', fontSize: 9 }, stars: { color: '#FFC400', fontSize: 12, marginTop: 7 }, reviewText: { color: '#555', fontSize: 11, lineHeight: 16, marginTop: 7 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 72, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF', paddingHorizontal: 16, elevation: 10 }, chatButton: { flex: 1, height: 49, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: '#F45100' }, chatText: { color: '#FFF', fontSize: 16, fontWeight: '800' }, shareButton: { width: 52, height: 49, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: '#F5F5F5' }, shareBottom: { fontSize: 23 },
});
