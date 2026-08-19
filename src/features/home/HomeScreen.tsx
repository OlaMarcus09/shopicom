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

import type { LocalListing } from '../listings/local-listing-service';
import { getCombinedListings } from '../listings/listing-service';
import { MarketplaceProductCard } from '../listings/MarketplaceProductCard';
import { marketplaceFeatures, type MarketplaceFeature } from '../../config/marketplace-features';
import { enabledMarketplaceSections, listingBelongsToSection } from '../../config/category-taxonomy';

const homeAssets = {
  promo: require('../../../assets/home/home-promo-complete-guyman.png'),
};

type CategoryKind = 'food' | 'hotels' | 'services' | 'jobs' | 'property';

const categories: Array<{ feature: MarketplaceFeature; kind: CategoryKind; label: string }> = [
  { feature: 'services', kind: 'services', label: 'Service' },
  { feature: 'hotels', kind: 'hotels', label: 'Hotels' },
  { feature: 'food', kind: 'food', label: 'Food' },
  { feature: 'property', kind: 'property', label: 'Property' },
  { feature: 'jobs', kind: 'jobs', label: 'Jobs' },
];

const discoveryFilters = [
  'Recommend',
  ...(enabledMarketplaceSections.find((section) => section.id === 'products')?.categories.slice(0, 3).map((category) => category.name) || []),
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

  if (kind === 'jobs') {
    return (
      <View style={styles.categoryIconBox}>
        <View style={styles.jobCase} />
        <View style={styles.jobHandle} />
        <View style={styles.jobLine} />
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

function CategoryShortcut({ kind, label, enabled, onPress }: { kind: CategoryKind; label: string; enabled: boolean; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryCard,
        pressed && styles.pressed,
      ]}
    >
      <CategoryIcon kind={kind} />
      <Text numberOfLines={1} style={styles.categoryLabel}>
        {label}
      </Text>
      {!enabled ? <View pointerEvents="none" style={styles.comingSoonOverlay}><Text style={styles.comingSoonLabel}>Coming Soon</Text></View> : null}
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

export type HomeScreenProps = {
  displayName?: string | null;
  listingScope?: MarketplaceFeature;
  pageTitle?: string;
  onBack?: () => void;
  onOpenCategory?: (category: string) => void;
  onOpenHotSelling?: () => void;
  onOpenListing?: (listing: LocalListing) => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onOpenSearch?: () => void;
};

export function HomeScreen({ displayName, listingScope, pageTitle = 'Listings', onBack, onOpenCategory, onOpenHotSelling, onOpenListing, onOpenNotifications, onOpenProfile, onOpenSearch }: HomeScreenProps) {
  const [localListings, setLocalListings] = useState<LocalListing[]>([]);
  const [discoveryFilter, setDiscoveryFilter] = useState('Recommend');
  useEffect(() => {
    getCombinedListings()
      .then((items) => setLocalListings(listingScope ? items.filter((item) => listingBelongsToSection(item.category, listingScope)) : items))
      .catch(() => setLocalListings([]));
  }, [listingScope]);
  const initial = displayName?.trim().charAt(0).toUpperCase() || 'A';
  const { width: screenWidth } = useWindowDimensions();
  const promoWidth = Math.max(screenWidth - 28, 0);
  const promoHeight = promoWidth * (384 / 790);
  const productWidth = Math.min(156, (screenWidth - 42) / 2);
  const discoveryCardWidth = Math.max(0, (screenWidth - 42) / 2);
  const discoveryListings = localListings.filter((listing) => {
    if (discoveryFilter === 'Recommend') return true;
    const searchable = [listing.category, listing.subCategory, listing.type, listing.title]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return searchable.includes(discoveryFilter.toLowerCase());
  });

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        {onBack ? <Pressable accessibilityLabel="Go back" accessibilityRole="button" hitSlop={10} onPress={onBack} style={styles.backButton}><Text style={styles.backButtonText}>‹</Text></Pressable> : null}
        <Pressable accessibilityLabel="Open profile" accessibilityRole="button" onPress={onOpenProfile} style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Search listings"
          accessibilityRole="button"
          onPress={onOpenSearch}
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
          onPress={onOpenNotifications}
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

      <Text style={styles.listingsTitle}>{pageTitle}</Text>
      <ScrollView
        contentContainerStyle={styles.categoryRow}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((category) => (
          <CategoryShortcut key={category.kind} {...category} enabled={marketplaceFeatures[category.feature]} onPress={() => onOpenCategory?.(category.label)} />
        ))}
      </ScrollView>

      <SectionHeader onViewAll={onOpenHotSelling} suffix="🔥">Hot Selling Product</SectionHeader>
      <ScrollView
        contentContainerStyle={styles.productRow}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {localListings.map((listing) => <MarketplaceProductCard key={listing.id} choiceBadge imageHeight={126} listing={listing} onPress={() => onOpenListing?.(listing)} rating={5} width={productWidth} />)}
        {!localListings.length ? <Text style={styles.emptyProducts}>No products posted yet.</Text> : null}
      </ScrollView>

      <SectionHeader onViewAll={onOpenHotSelling} suffix="⌖">Best Selling Near You</SectionHeader>
      {localListings.length ? <ScrollView horizontal contentContainerStyle={styles.nearbyRow} showsHorizontalScrollIndicator={false}>
        {localListings.map((listing) => <MarketplaceProductCard key={listing.id} imageHeight={126} listing={listing} onPress={() => onOpenListing?.(listing)} rating={4.5} width={productWidth} />)}
      </ScrollView> : <View style={styles.nearbyPlaceholder}><Text style={styles.nearbyPlaceholderText}>No nearby listings yet.</Text></View>}

      <ScrollView
        contentContainerStyle={styles.discoveryTabs}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {discoveryFilters.map((filter) => {
          const active = discoveryFilter === filter;
          return (
            <Pressable
              accessibilityRole="button"
              key={filter}
              onPress={() => setDiscoveryFilter(filter)}
              style={[styles.discoveryTab, active && styles.discoveryTabActive]}
            >
              <Text style={[styles.discoveryTabText, active && styles.discoveryTabTextActive]}>
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {discoveryListings.length ? (
        <View style={styles.discoveryGrid}>
          {discoveryListings.map((listing) => <MarketplaceProductCard key={listing.id} imageHeight={150} listing={listing} onPress={() => onOpenListing?.(listing)} rating={4.5} width={discoveryCardWidth} />)}
        </View>
      ) : (
        <View style={styles.discoveryEmpty}>
          <Text style={styles.discoveryEmptyTitle}>No {discoveryFilter.toLowerCase()} listings yet</Text>
          <Text style={styles.discoveryEmptyCopy}>Products posted in this category will appear here.</Text>
        </View>
      )}
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
  backButton: {
    width: 30,
    height: 42,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 3,
  },
  backButtonText: {
    color: '#333333',
    fontSize: 34,
    lineHeight: 36,
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
    position: 'relative',
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
  comingSoonOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.58)',
  },
  comingSoonLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  productBox: { position: 'absolute', left: 3, top: 3, width: 19, height: 18, borderWidth: 2, borderColor: '#5C6BC0', borderRadius: 3 },
  productBoxLine: { position: 'absolute', left: 7, top: 12, width: 12, height: 2, backgroundColor: '#5C6BC0' },
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
  jobCase: {
    position: 'absolute',
    left: 2,
    top: 8,
    width: 22,
    height: 15,
    borderWidth: 2,
    borderColor: '#5C6BC0',
    borderRadius: 3,
  },
  jobHandle: {
    position: 'absolute',
    left: 8,
    top: 3,
    width: 10,
    height: 7,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#5C6BC0',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  jobLine: {
    position: 'absolute',
    left: 3,
    top: 14,
    width: 20,
    height: 2,
    backgroundColor: '#5C6BC0',
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
  emptyProducts: { color: '#777', fontSize: 13, paddingHorizontal: 5, paddingVertical: 35 },
  localProductCard: { overflow: 'hidden', borderWidth: 1, borderColor: '#EEE', borderRadius: 13, backgroundColor: '#FFF', paddingBottom: 8 },
  localProductTitle: { color: '#222', fontSize: 12, fontWeight: '700', paddingHorizontal: 8, marginTop: 5 },
  localProductPrice: { color: '#F45100', fontSize: 13, fontWeight: '800', paddingHorizontal: 8, marginTop: 3 },
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
  nearbyRow: { gap: 10, paddingHorizontal: 16, paddingTop: 12 },
  nearbyCard: { width: 170, overflow: 'hidden', borderWidth: 1, borderColor: '#EEE', borderRadius: 13, backgroundColor: '#FFF' },
  nearbyImage: { width: 170, height: 108, backgroundColor: '#F7F7F7' },
  nearbyCopy: { padding: 9 },
  nearbyName: { color: '#222', fontSize: 12, fontWeight: '700' },
  nearbyPrice: { color: '#F45100', fontSize: 13, fontWeight: '800', marginTop: 4 },
  nearbyLocation: { color: '#777', fontSize: 10, marginTop: 4 },
  discoveryTabs: { gap: 8, paddingHorizontal: 16, paddingTop: 22, paddingBottom: 13 },
  discoveryTab: { minHeight: 34, justifyContent: 'center', paddingHorizontal: 14, borderWidth: 1, borderColor: '#E7E7E7', borderRadius: 18, backgroundColor: '#FFF' },
  discoveryTabActive: { borderColor: '#F45100', backgroundColor: '#FFF3ED' },
  discoveryTabText: { color: '#686868', fontSize: 12, fontWeight: '600' },
  discoveryTabTextActive: { color: '#F45100', fontWeight: '800' },
  discoveryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16 },
  discoveryCard: { overflow: 'hidden', borderWidth: 1, borderColor: '#ECECEC', borderRadius: 13, backgroundColor: '#FFF' },
  discoveryImage: { width: '100%', aspectRatio: 1.2, backgroundColor: '#F7F7F7' },
  discoveryCopy: { padding: 9 },
  discoveryName: { minHeight: 32, color: '#242424', fontSize: 12, lineHeight: 16, fontWeight: '700' },
  discoveryPrice: { color: '#F45100', fontSize: 13, fontWeight: '800', marginTop: 4 },
  discoveryLocation: { color: '#777', fontSize: 10, marginTop: 5 },
  discoveryEmpty: { alignItems: 'center', marginHorizontal: 16, paddingHorizontal: 20, paddingVertical: 28, borderRadius: 14, backgroundColor: '#FAFAFA' },
  discoveryEmptyTitle: { color: '#333', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  discoveryEmptyCopy: { color: '#777', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 5 },
  pressed: {
    opacity: 0.8,
  },
});
