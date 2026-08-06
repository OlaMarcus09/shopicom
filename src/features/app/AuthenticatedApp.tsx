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
  const color = active ? '#FFFFFF' : '#6E6E6E';

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
        const isHome = tab.key === 'home';

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
                isHome && styles.homeTabIconContainer,
                active && isHome && styles.homeTabIconSelected,
              ]}
            >
              <TabIcon active={active && isHome} tab={tab.key} />
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

  let screen;
  if (activeTab === 'home') {
    screen = <HomeScreen displayName={props.user.displayName} />;
  } else if (activeTab === 'categories') {
    screen = <CategoriesScreen />;
  } else if (activeTab === 'profile') {
    screen = <ProfileScreen {...props} />;
  } else {
    screen = <PlaceholderScreen label={tabs.find((tab) => tab.key === activeTab)?.label ?? ''} />;
  }

  return (
    <View style={styles.app}>
      <View style={styles.screen}>{screen}</View>
      <BottomTabBar activeTab={activeTab} onSelect={setActiveTab} />
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
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingBottom: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  tabButton: {
    width: '20%',
    minHeight: 68,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tabIconContainer: {
    width: 36,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeTabIconContainer: {
    width: 62,
    height: 62,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    borderRadius: 31,
    marginBottom: 1,
  },
  homeTabIconSelected: {
    backgroundColor: '#F45100',
    shadowColor: '#FF8A3D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 8,
  },
  tabLabel: {
    color: '#6E6E6E',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  tabLabelSelected: {
    color: '#F45100',
  },
  addIcon: {
    fontSize: 36,
    lineHeight: 36,
    fontWeight: '300',
  },
  categoryGridIcon: {
    width: 28,
    height: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  categoryGridDot: {
    width: 12,
    height: 12,
    borderWidth: 2.5,
    borderRadius: 6,
  },
  homeIcon: {
    fontSize: 39,
    lineHeight: 41,
    fontWeight: '700',
  },
  inboxIcon: {
    width: 25,
    height: 21,
    borderWidth: 2.5,
    borderRadius: 2,
  },
  inboxTail: {
    position: 'absolute',
    left: 2,
    bottom: -6,
    width: 9,
    height: 9,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    transform: [{ skewY: '-28deg' }],
  },
  profileIcon: {
    width: 28,
    height: 29,
    alignItems: 'center',
  },
  profileHead: {
    width: 11,
    height: 11,
    borderWidth: 2.5,
    borderRadius: 6,
  },
  profileBody: {
    width: 24,
    height: 13,
    borderWidth: 2.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: 3,
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
