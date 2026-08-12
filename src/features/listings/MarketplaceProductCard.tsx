import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  getFavoriteListingIds,
  toggleLocalFavorite,
  type LocalListing,
} from './local-listing-service';

type MarketplaceProductCardProps = {
  listing: LocalListing;
  width?: number;
  imageHeight?: number;
  choiceBadge?: boolean;
  oldPrice?: number;
  rating?: number;
  sellerVerified?: boolean;
  onPress?: () => void;
  onReport?: () => void;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-GH', {
    maximumFractionDigits: 2,
  }).format(price);
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <Text style={[styles.heartIcon, filled && styles.heartIconFilled]}>
      {filled ? '♥' : '♡'}
    </Text>
  );
}

function ReportIcon() {
  return (
    <View style={styles.flagIcon}>
      <View style={styles.flagPole} />
      <View style={styles.flagBody} />
    </View>
  );
}

export function MarketplaceProductCard({
  listing,
  width = 156,
  imageHeight = 142,
  choiceBadge = false,
  oldPrice,
  rating,
  sellerVerified = false,
  onPress,
  onReport,
}: MarketplaceProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getFavoriteListingIds()
      .then((ids) => {
        if (isMounted) setIsFavorite(ids.includes(listing.id));
      })
      .catch(() => undefined);
    return () => {
      isMounted = false;
    };
  }, [listing.id]);

  const toggleFavorite = async () => {
    try {
      setIsFavorite(await toggleLocalFavorite(listing.id));
    } catch {
      // Keep the card usable if local storage is temporarily unavailable.
    }
  };

  return (
    <Pressable
      accessibilityLabel={`Open ${listing.title}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={[styles.imageFrame, { height: imageHeight }]}>
        <Image
          accessibilityLabel={`${listing.title} product image`}
          resizeMode="cover"
          source={{ uri: listing.imageUrls[0] }}
          style={styles.image}
        />

        {choiceBadge ? (
          <View style={styles.choiceBadge}>
            <Text style={styles.choiceText}>Choice</Text>
          </View>
        ) : null}

        <View style={styles.imageActions}>
          <Pressable
            accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            accessibilityRole="button"
            hitSlop={6}
            onPress={toggleFavorite}
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
          >
            <HeartIcon filled={isFavorite} />
          </Pressable>
          <Pressable
            accessibilityLabel="Report listing"
            accessibilityRole="button"
            disabled={!onReport}
            hitSlop={6}
            onPress={onReport}
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
          >
            <ReportIcon />
          </Pressable>
        </View>
      </View>

      <View style={styles.details}>
        <Text numberOfLines={2} style={styles.title}>
          {listing.title}
        </Text>

        <View style={styles.sellerRow}>
          <Text numberOfLines={1} style={styles.seller}>
            {listing.sellerName}
          </Text>
          {sellerVerified ? <Text style={styles.verified}>✓</Text> : null}
        </View>

        <View style={styles.priceRow}>
          <Text numberOfLines={1} style={styles.price}>
            GHS {formatPrice(listing.price)}
          </Text>
          {oldPrice && oldPrice > listing.price ? (
            <Text numberOfLines={1} style={styles.oldPrice}>
              GHS {formatPrice(oldPrice)}
            </Text>
          ) : null}
        </View>

        <View style={styles.metaRow}>
          <Text numberOfLines={1} style={styles.location}>
            ⌖ {listing.location}
          </Text>
          {typeof rating === 'number' ? (
            <Text style={styles.rating}>★ {rating.toFixed(1)}</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  cardPressed: {
    opacity: 0.86,
  },
  imageFrame: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#F6F6F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  choiceBadge: {
    position: 'absolute',
    left: 7,
    top: 7,
    minWidth: 43,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#FF5A27',
    paddingHorizontal: 7,
  },
  choiceText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  imageActions: {
    position: 'absolute',
    top: 7,
    right: 7,
    gap: 5,
  },
  actionButton: {
    width: 27,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  actionPressed: {
    opacity: 0.7,
  },
  heartIcon: {
    color: '#3E3E3E',
    fontSize: 20,
    lineHeight: 22,
  },
  heartIconFilled: {
    color: '#FF5A27',
  },
  flagIcon: {
    width: 13,
    height: 15,
  },
  flagPole: {
    position: 'absolute',
    left: 1,
    top: 0,
    width: 1.5,
    height: 15,
    borderRadius: 1,
    backgroundColor: '#555555',
  },
  flagBody: {
    position: 'absolute',
    left: 2,
    top: 1,
    width: 10,
    height: 7,
    borderWidth: 1.4,
    borderLeftWidth: 0,
    borderColor: '#555555',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  details: {
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 9,
  },
  title: {
    minHeight: 30,
    color: '#202020',
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
  },
  sellerRow: {
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  seller: {
    maxWidth: '88%',
    color: '#777777',
    fontSize: 9.5,
    lineHeight: 13,
  },
  verified: {
    width: 13,
    height: 13,
    overflow: 'hidden',
    borderRadius: 7,
    backgroundColor: '#2796F3',
    color: '#FFFFFF',
    fontSize: 8,
    lineHeight: 13,
    textAlign: 'center',
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 5,
  },
  price: {
    flexShrink: 1,
    color: '#F45100',
    fontSize: 13,
    fontWeight: '800',
  },
  oldPrice: {
    flexShrink: 1,
    color: '#9A9A9A',
    fontSize: 9,
    textDecorationLine: 'line-through',
    marginLeft: 5,
  },
  metaRow: {
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  location: {
    flex: 1,
    color: '#777777',
    fontSize: 9,
    marginRight: 4,
  },
  rating: {
    color: '#E79B10',
    fontSize: 9,
    fontWeight: '700',
  },
});
