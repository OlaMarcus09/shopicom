import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const products = [
  require('../../../assets/listings/product-card-smart-watch.png'),
  require('../../../assets/home/product-card-sneakers.png'),
];

export function VendorStorefrontScreen({ onBack, onOpenProduct }: { onBack: () => void; onOpenProduct: () => void }) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 32) / 2;
  const cardHeight = cardWidth * (550 / 376);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Pressable onPress={onBack}><Text style={styles.back}>‹</Text></Pressable><Text style={styles.headerTitle}>Sample Store</Text><Text style={styles.share}>⌯</Text></View>
        <View style={styles.profile}><View style={styles.avatar}><Text style={styles.avatarText}>S</Text><View style={styles.onlineDot} /></View><Text style={styles.storeName}>Sample Store</Text><Text style={styles.id}>ID: SA616915</Text><Text style={styles.location}>⌖  Area, City</Text><View style={styles.stats}><View><Text style={styles.statValue}>0</Text><Text style={styles.statLabel}>Followers</Text></View><View><Text style={styles.statValue}>0.0</Text><Text style={styles.statLabel}>Rating</Text></View><View><Text style={styles.statValue}>0</Text><Text style={styles.statLabel}>Following</Text></View></View><Text style={styles.bio}>No bio yet. Tell others about yourself</Text><View style={styles.actions}><Pressable style={styles.follow}><Text style={styles.followText}>FOLLOW</Text></Pressable><Pressable style={styles.message}><Text style={styles.messageIcon}>◯</Text></Pressable></View></View>
        <View style={styles.listingsHeader}><Text style={styles.listingsTitle}>LISTINGS</Text><Text style={styles.ads}>2 ADS</Text></View>
        <View style={styles.grid}>{products.map((source, index) => <Pressable key={index} onPress={onOpenProduct}><Image resizeMode="contain" source={source} style={{ width: cardWidth, height: cardHeight }} /></Pressable>)}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' }, content: { paddingBottom: 30 },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }, back: { fontSize: 33, color: '#333' }, headerTitle: { fontSize: 20, fontWeight: '700' }, share: { fontSize: 23 },
  profile: { alignItems: 'center', backgroundColor: '#FFF5F0', paddingTop: 26, paddingBottom: 24 }, avatar: { width: 110, height: 110, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFF', borderRadius: 55, backgroundColor: '#4A4545', elevation: 3 }, avatarText: { color: '#FFF', fontSize: 45, fontWeight: '500' }, onlineDot: { position: 'absolute', left: 3, bottom: 5, width: 20, height: 20, borderWidth: 2, borderColor: '#FFF', borderRadius: 10, backgroundColor: '#21C968' }, storeName: { color: '#171717', fontSize: 24, fontWeight: '700', marginTop: 14 }, id: { color: '#999', fontSize: 14, marginTop: 6 }, location: { color: '#666', fontSize: 15, fontWeight: '500', marginTop: 14 },
  stats: { width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginTop: 25 }, statValue: { color: '#F1645E', fontSize: 23, fontWeight: '700', textAlign: 'center' }, statLabel: { color: '#666', fontSize: 13, fontWeight: '600', marginTop: 3 }, bio: { color: '#777', fontSize: 14, marginTop: 22 }, actions: { width: '100%', flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: 24 }, follow: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: '#F45100' }, followText: { color: '#FFF', fontSize: 16, fontWeight: '700' }, message: { width: 60, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#F45100', borderRadius: 15 }, messageIcon: { color: '#F45100', fontSize: 25 },
  listingsHeader: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18 }, listingsTitle: { color: '#222', fontSize: 16, fontWeight: '700', borderLeftWidth: 4, borderLeftColor: '#F45100', paddingLeft: 8 }, ads: { color: '#F45100', fontSize: 10, fontWeight: '700', backgroundColor: '#FFF1EB', borderRadius: 9, paddingHorizontal: 8, paddingVertical: 5 }, grid: { flexDirection: 'row', gap: 10, paddingHorizontal: 11 },
});
