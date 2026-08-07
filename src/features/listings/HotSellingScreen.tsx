import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const products = [
  require('../../../assets/listings/product-card-smart-watch.png'),
  require('../../../assets/home/product-card-sneakers.png'),
  require('../../../assets/home/product-card-sneakers.png'),
  require('../../../assets/listings/product-card-smart-watch.png'),
  require('../../../assets/listings/product-card-smart-watch.png'),
  require('../../../assets/home/product-card-sneakers.png'),
];

export function HotSellingScreen({ onBack, onOpenProduct }: { onBack: () => void; onOpenProduct: () => void }) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 42) / 2;
  const cardHeight = cardWidth * (550 / 376);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={onBack}><Text style={styles.back}>‹</Text></Pressable>
        <Text style={styles.title}>Hot Selling Products</Text>
        <Text style={styles.fire}>🔥</Text>
      </View>
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {products.map((source, index) => (
          <Pressable key={index} onPress={onOpenProduct} style={styles.cardButton}>
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
});
