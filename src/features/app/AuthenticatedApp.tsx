import type { User } from 'firebase/auth';
import { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { HomeScreen } from '../home/HomeScreen';
import { CategoriesScreen } from '../categories/CategoriesScreen';
import { CreateListingScreen } from '../listings/CreateListingScreen';
import { MessagesScreen } from '../messages/MessagesScreen';
import { ChatScreen } from '../messages/ChatScreen';
import { ListingDetailsScreen } from '../listings/ListingDetailsScreen';
import { HotSellingScreen } from '../listings/HotSellingScreen';
import { VendorStorefrontScreen } from '../listings/VendorStorefrontScreen';
import { ProfileDetailsScreen } from '../profile/ProfileDetailsScreen';
import type { LocalListing } from '../listings/local-listing-service';
import { MyListingsScreen } from '../listings/MyListingsScreen';
import { SearchListingsScreen } from '../listings/SearchListingsScreen';
import { FavoritesScreen } from '../listings/FavoritesScreen';

type AppTab = 'add' | 'categories' | 'home' | 'inbox' | 'profile';

const tabs: Array<{ key: AppTab; label: string }> = [
  { key: 'add', label: 'Add' },
  { key: 'categories', label: 'Categories' },
  { key: 'home', label: 'Home' },
  { key: 'inbox', label: 'Inbox' },
  { key: 'profile', label: 'Profile' },
];

type AuthenticatedAppProps = {
  errorMessage: string | null;
  isSubmitting: boolean;
  onLogout: () => void;
  user: User;
};

function TabIcon({ active, tab }: { active: boolean; tab: AppTab }) {
  const color = active ? '#F45100' : '#777777';

  if (tab === 'add') {
    return <Text style={[styles.addIcon, { color }]}>+</Text>;
  }

  if (tab === 'categories') {
    return (
      <View style={styles.categoryGridIcon}>
        {[0, 1, 2, 3].map((item) => (
          <View
            key={item}
            style={[styles.categoryGridDot, { borderColor: color }]}
          />
        ))}
      </View>
    );
  }

  if (tab === 'home') {
    return <Text style={[styles.homeIcon, { color }]}>⌂</Text>;
  }

  if (tab === 'inbox') {
    return (
      <View style={[styles.inboxIcon, { borderColor: color }]}>
        <View style={[styles.inboxTail, { borderColor: color }]} />
      </View>
    );
  }

  return (
    <View style={styles.profileIcon}>
      <View style={[styles.profileHead, { borderColor: color }]} />
      <View style={[styles.profileBody, { borderColor: color }]} />
    </View>
  );
}

function BottomTabBar({
  activeTab,
  onSelect,
}: {
  activeTab: AppTab;
  onSelect: (tab: AppTab) => void;
}) {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const active = activeTab === tab.key;

        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            style={styles.tabButton}
          >
            <View
              style={[
                styles.tabIconContainer,
                active && styles.tabIconSelected,
              ]}
            >
              <TabIcon active={active} tab={tab.key} />
            </View>
            <Text
              numberOfLines={1}
              style={[styles.tabLabel, active && styles.tabLabelSelected]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function PlaceholderScreen({ label }: { label: string }) {
  return (
    <View style={styles.placeholderScreen}>
      <Text style={styles.placeholderTitle}>{label}</Text>
      <Text style={styles.placeholderText}>
        This screen will be implemented from its saved Figma reference next.
      </Text>
    </View>
  );
}

function ProfileScreen({
  errorMessage,
  isSubmitting,
  onLogout,
  user,
}: AuthenticatedAppProps) {
  return (
    <View style={styles.profileScreen}>
      <Text style={styles.profileTitle}>
        Welcome{user.displayName ? `, ${user.displayName}` : ''}
      </Text>
      <Text style={styles.profileEmail}>{user.email}</Text>
      <Text style={styles.profileStatus}>Your session is active.</Text>

      {errorMessage ? (
        <Text accessibilityLiveRegion="polite" style={styles.errorText}>
          {errorMessage}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        disabled={isSubmitting}
        onPress={onLogout}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.pressed,
          isSubmitting && styles.disabled,
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.logoutLabel}>Log out</Text>
        )}
      </Pressable>
    </View>
  );
}

export function AuthenticatedApp(props: AuthenticatedAppProps) {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isListingOpen, setIsListingOpen] = useState(false);
  const [isHotSellingOpen, setIsHotSellingOpen] = useState(false);
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<LocalListing | undefined>();
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  let screen;
  if (isFavoritesOpen) {
    screen = <FavoritesScreen onBack={() => setIsFavoritesOpen(false)} onOpenListing={(listing) => { setSelectedListing(listing); setIsFavoritesOpen(false); setIsListingOpen(true); }} />;
  } else if (isSearchOpen) {
    screen = <SearchListingsScreen onBack={() => setIsSearchOpen(false)} onOpenListing={(listing) => { setSelectedListing(listing); setIsSearchOpen(false); setIsListingOpen(true); }} />;
  } else if (isMyListingsOpen) {
    screen = <MyListingsScreen onBack={() => setIsMyListingsOpen(false)} onOpenListing={(listing) => { setSelectedListing(listing); setIsMyListingsOpen(false); setIsListingOpen(true); }} />;
  } else if (isVendorOpen) {
    screen = <VendorStorefrontScreen onBack={() => setIsVendorOpen(false)} onOpenProduct={() => setIsVendorOpen(false)} />;
  } else if (isListingOpen) {
    screen = <ListingDetailsScreen listing={selectedListing} onBack={() => { setSelectedListing(undefined); setIsListingOpen(false); }} onChat={() => { setIsListingOpen(false); setIsHotSellingOpen(false); setIsChatOpen(true); }} onOpenVendor={() => setIsVendorOpen(true)} />;
  } else if (isHotSellingOpen) {
    screen = <HotSellingScreen onBack={() => setIsHotSellingOpen(false)} onOpenProduct={(listing) => { setSelectedListing(listing); setIsHotSellingOpen(false); setIsListingOpen(true); }} />;
  } else if (isChatOpen) {
    screen = <ChatScreen onBack={() => setIsChatOpen(false)} onViewItem={() => setIsListingOpen(true)} />;
  } else if (activeTab === 'home') {
    screen = <HomeScreen displayName={props.user.displayName} onOpenCategory={(category) => { setCategoryFilter(category); setActiveTab('categories'); }} onOpenHotSelling={() => setIsHotSellingOpen(true)} onOpenListing={(listing) => { setSelectedListing(listing); setIsListingOpen(true); }} onOpenSearch={() => setIsSearchOpen(true)} />;
  } else if (activeTab === 'add') {
    screen = <CreateListingScreen onClose={() => setActiveTab('home')} />;
  } else if (activeTab === 'categories') {
    screen = <CategoriesScreen initialCategory={categoryFilter} onBack={() => setActiveTab('home')} onOpenListing={(listing) => { setSelectedListing(listing); setIsListingOpen(true); }} onOpenSearch={() => setIsSearchOpen(true)} />;
  } else if (activeTab === 'inbox') {
    screen = <MessagesScreen onBack={() => setActiveTab('home')} onOpenConversation={() => setIsChatOpen(true)} />;
  } else if (activeTab === 'profile') {
    screen = <ProfileDetailsScreen {...props} onOpenFavorites={() => setIsFavoritesOpen(true)} onOpenMyListings={() => setIsMyListingsOpen(true)} />;
  } else {
    screen = <PlaceholderScreen label={tabs.find((tab) => tab.key === activeTab)?.label ?? ''} />;
  }

  return (
    <View style={styles.app}>
      <View style={styles.screen}>{screen}</View>
      {isChatOpen || isListingOpen || isHotSellingOpen || isVendorOpen || isMyListingsOpen || isSearchOpen || isFavoritesOpen ? null : <BottomTabBar activeTab={activeTab} onSelect={setActiveTab} />}
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop:
      Platform.OS === 'android' ? (NativeStatusBar.currentHeight ?? 0) : 0,
  },
  screen: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 10,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  tabButton: {
    width: '20%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabIconContainer: {
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabIconSelected: {
    backgroundColor: '#FFF0E8',
  },
  tabLabel: {
    color: '#6E6E6E',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
  },
  tabLabelSelected: {
    color: '#F45100',
  },
  addIcon: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '400',
  },
  categoryGridIcon: {
    width: 22,
    height: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  categoryGridDot: {
    width: 9,
    height: 9,
    borderWidth: 2,
    borderRadius: 5,
  },
  homeIcon: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '600',
  },
  inboxIcon: {
    width: 22,
    height: 18,
    borderWidth: 2,
    borderRadius: 2,
  },
  inboxTail: {
    position: 'absolute',
    left: 2,
    bottom: -5,
    width: 8,
    height: 8,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ skewY: '-28deg' }],
  },
  profileIcon: {
    width: 24,
    height: 25,
    alignItems: 'center',
  },
  profileHead: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderRadius: 5,
  },
  profileBody: {
    width: 21,
    height: 11,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: 2,
  },
  placeholderScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 78,
    backgroundColor: '#FFFFFF',
  },
  placeholderTitle: {
    color: '#171717',
    fontSize: 30,
    fontWeight: '700',
  },
  placeholderText: {
    color: '#737373',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
  },
  profileScreen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 78,
    backgroundColor: '#FFFFFF',
  },
  profileTitle: {
    color: '#171717',
    fontSize: 30,
    fontWeight: '700',
  },
  profileEmail: {
    color: '#525252',
    fontSize: 16,
    marginTop: 8,
  },
  profileStatus: {
    color: '#166534',
    fontSize: 14,
    marginBottom: 28,
    marginTop: 12,
  },
  logoutButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#FF5A27',
  },
  logoutLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.55,
  },
});
