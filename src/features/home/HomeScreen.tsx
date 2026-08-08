import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';

import { getLocalListings, type LocalListing } from '../listings/local-listing-service';

const homeAssets = {
  promo: require('../../../assets/home/home-promo-complete-guyman.png'),
  sneakers: require('../../../assets/home/product-card-sneakers.png'),
  watch: require('../../../assets/home/product-card-watch.png'),
};

type CategoryKind = 'food' | 'hotels' | 'services';

const categories: Array<{ kind: CategoryKind; label: string }> = [
  { kind: 'food', label: 'Food' },
  { kind: 'hotels', label: 'Hotels' },
  { kind: 'services', label: 'Services' },
];

function SearchIcon() {
  return (
    <View style={styles.searchIcon}>
      <View style={styles.searchIconCircle} />
      <View style={styles.searchIconHandle} />
    </View>
  );
}

function BellIcon() {
  return (
    <View accessibilityElementsHidden style={styles.bellIcon}>
      <View style={styles.bellDome} />
      <View style={styles.bellBase} />
      <View style={styles.bellClapper} />
    </View>
  );
}

function CategoryIcon({ kind }: { kind: CategoryKind }) {
  if (kind === 'food') {
    return (
      <View style={styles.categoryIconBox}>
        <View style={[styles.foodLine, styles.foodLineOne]} />
        <View style={[styles.foodLine, styles.foodLineTwo]} />
        <View style={[styles.foodLine, styles.foodLineThree]} />
      </View>
    );
  }

  if (kind === 'hotels') {
    return (
      <View style={styles.categoryIconBox}>
        <View style={styles.hotelBuilding}>
          <View style={styles.hotelWindow} />
          <View style={styles.hotelWindow} />
        </View>
        <View style={styles.hotelSide} />
      </View>
    );
  }

  return (
    <View style={styles.categoryIconBox}>
      <View style={styles.serviceHandle} />
      <View style={styles.serviceHead} />
    </View>
  );
}

function CategoryShortcut({ kind, label }: { kind: CategoryKind; label: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => undefined}
      style={({ pressed }) => [
        styles.categoryCard,
        pressed && styles.pressed,
      ]}
    >
      <CategoryIcon kind={kind} />
      <Text numberOfLines={1} style={styles.categoryLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

function SectionHeader({
  children,
  suffix,
  onViewAll,
}: {
  children: string;
  suffix?: string;
  onViewAll?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>{children}</Text>
        {suffix ? <Text style={styles.sectionSuffix}>{suffix}</Text> : null}
      </View>
      <Pressable accessibilityRole="button" hitSlop={8} onPress={onViewAll}>
        <Text style={styles.viewAll}>view all ›</Text>
      </Pressable>
    </View>
  );
}

export function HomeScreen({ displayName, onOpenHotSelling }: { displayName?: string | null; onOpenHotSelling?: () => void }) {
  const [localListings, setLocalListings] = useState<LocalListing[]>([]);
  useEffect(() => { getLocalListings().then(setLocalListings).catch(() => setLocalListings([])); }, []);
  const initial = displayName?.trim().charAt(0).toUpperCase() || 'A';
  const { width: screenWidth } = useWindowDimensions();
  const promoWidth = Math.max(screenWidth - 28, 0);
  const promoHeight = promoWidth * (384 / 790);
  const productWidth = Math.min(156, (screenWidth - 42) / 2);
  const productHeight = productWidth * (550 / 376);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        <Pressable
          accessibilityLabel="Search listings"
          accessibilityRole="button"
          onPress={() => undefined}
          style={styles.searchButton}
        >
          <SearchIcon />
          <Text numberOfLines={1} style={styles.searchPlaceholder}>
            Search for anything
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Notifications"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => undefined}
          style={styles.notificationButton}
        >
          <BellIcon />
        </Pressable>
      </View>

      <View style={styles.promoFrame}>
        <Image
          accessibilityLabel="Complete Guyman food deal advertisement"
          resizeMode="contain"
          source={homeAssets.promo}
          style={[styles.promo, { width: promoWidth, height: promoHeight }]}
        />
      </View>

      <Text style={styles.listingsTitle}>Listings</Text>
      <ScrollView
        contentContainerStyle={styles.categoryRow}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((category) => (
          <CategoryShortcut key={category.kind} {...category} />
        ))}
      </ScrollView>

      <SectionHeader onViewAll={onOpenHotSelling} suffix="🔥">Hot Selling Product</SectionHeader>
      <ScrollView
        contentContainerStyle={styles.productRow}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {localListings.map((listing) => (
          <Pressable key={listing.id} accessibilityRole="button" onPress={onOpenHotSelling}>
            <Image
              accessibilityLabel={`${listing.title} listing`}
              resizeMode="contain"
              source={{ uri: listing.imageUrls[0] }}
              style={[styles.productCard, { width: productWidth, height: productHeight }]}
            />
          </Pressable>
        ))}
        <Pressable accessibilityRole="button" onPress={() => undefined}>
          <Image
            accessibilityLabel="White sneakers listing"
            resizeMode="contain"
            source={homeAssets.sneakers}
            style={[styles.productCard, { width: productWidth, height: productHeight }]}
          />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => undefined}>
          <Image
            accessibilityLabel="Black watch listing"
            resizeMode="contain"
            source={homeAssets.watch}
            style={[styles.productCard, { width: productWidth, height: productHeight }]}
          />
        </Pressable>
      </ScrollView>

      <SectionHeader suffix="⌖">Best Selling Near</SectionHeader>
      <View style={styles.nearbyPlaceholder}>
        <Text style={styles.nearbyPlaceholderText}>
          Nearby listings will load here.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 112,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  avatar: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF5A27',
    borderRadius: 21,
    backgroundColor: '#5D5859',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '400',
  },
  searchButton: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 22,
    backgroundColor: '#FAFAFA',
    marginLeft: 10,
    paddingHorizontal: 14,
  },
  searchIcon: {
    width: 21,
    height: 21,
    marginRight: 9,
  },
  searchIconCircle: {
    position: 'absolute',
    left: 1,
    top: 1,
    width: 16,
    height: 16,
    borderWidth: 2.5,
    borderColor: '#909090',
    borderRadius: 8,
  },
  searchIconHandle: {
    position: 'absolute',
    left: 15,
    top: 16,
    width: 10,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#909090',
    transform: [{ rotate: '45deg' }],
  },
  searchPlaceholder: {
    flex: 1,
    color: '#8F8F8F',
    fontSize: 15,
  },
  notificationButton: {
    width: 34,
    height: 42,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
  bellIcon: {
    width: 28,
    height: 30,
  },
  bellDome: {
    position: 'absolute',
    left: 4,
    top: 2,
    width: 20,
    height: 21,
    borderWidth: 2.5,
    borderBottomWidth: 0,
    borderColor: '#333333',
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
  },
  bellBase: {
    position: 'absolute',
    left: 1,
    top: 22,
    width: 26,
    height: 2.5,
    backgroundColor: '#333333',
  },
  bellClapper: {
    position: 'absolute',
    left: 11,
    top: 26,
    width: 7,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#333333',
  },
  promoFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  promo: {
    maxWidth: '100%',
  },
  listingsTitle: {
    color: '#000000',
    fontSize: 23,
    lineHeight: 29,
    fontWeight: '700',
    marginTop: 18,
    marginLeft: 16,
  },
  categoryRow: {
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  categoryCard: {
    width: 100,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 3,
  },
  categoryIconBox: {
    width: 24,
    height: 24,
    marginRight: 6,
  },
  categoryLabel: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
  },
  foodLine: {
    position: 'absolute',
    top: 3,
    width: 3,
    height: 23,
    borderRadius: 2,
    backgroundColor: '#18C66D',
  },
  foodLineOne: { left: 4 },
  foodLineTwo: { left: 10, height: 16 },
  foodLineThree: { left: 21 },
  hotelBuilding: {
    position: 'absolute',
    left: 3,
    top: 2,
    width: 15,
    height: 24,
    borderWidth: 2.5,
    borderColor: '#FF6548',
  },
  hotelWindow: {
    width: 4,
    height: 4,
    backgroundColor: '#FF6548',
    marginLeft: 3,
    marginTop: 3,
  },
  hotelSide: {
    position: 'absolute',
    left: 18,
    top: 12,
    width: 8,
    height: 14,
    borderWidth: 2.5,
    borderColor: '#FF6548',
  },
  serviceHandle: {
    position: 'absolute',
    left: 11,
    top: 8,
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: '#FF6548',
    transform: [{ rotate: '45deg' }],
  },
  serviceHead: {
    position: 'absolute',
    left: 3,
    top: 1,
    width: 14,
    height: 14,
    borderWidth: 3,
    borderColor: '#FF6548',
    borderRadius: 7,
    borderRightColor: 'transparent',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 17,
    paddingHorizontal: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  sectionTitle: {
    color: '#000000',
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '700',
  },
  sectionSuffix: {
    color: '#FF5A27',
    fontSize: 20,
    lineHeight: 27,
    marginLeft: 5,
  },
  viewAll: {
    color: '#FF5A27',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
  },
  productRow: {
    gap: 8,
    paddingHorizontal: 13,
    paddingTop: 12,
  },
  productCard: {
    resizeMode: 'contain',
  },
  nearbyPlaceholder: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
  },
  nearbyPlaceholderText: {
    color: '#737373',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.8,
  },
});
