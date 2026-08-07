import type { User } from 'firebase/auth';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = { errorMessage: string | null; isSubmitting: boolean; onLogout: () => void; user: User };

const accountItems = ['Become a Vendor', 'Favorites', 'Edit Profile', 'Privacy & Security'];
const supportItems = ['Help & Support', 'Terms and Policies', 'App Settings'];
const aboutItems = ['About Shopicom', 'Rate us on playstore'];

function MenuCard({ items }: { items: string[] }) {
  return <View style={styles.menuCard}>{items.map((item) => <Pressable key={item} style={styles.menuItem}><Text style={styles.menuIcon}>○</Text><Text style={styles.menuLabel}>{item}</Text><Text style={styles.arrow}>›</Text></Pressable>)}</View>;
}

export function ProfileDetailsScreen({ errorMessage, isSubmitting, onLogout, user }: Props) {
  const initial = user.displayName?.trim().charAt(0).toUpperCase() || 'A';
  return <View style={styles.screen}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><Text style={styles.headerTitle}>Profile</Text><Text style={styles.share}>⌯</Text></View>
      <View style={styles.profile}><View style={styles.avatar}><Text style={styles.avatarText}>{initial}</Text></View><Text style={styles.name}>{user.displayName || 'Shopicom User'}</Text><Text style={styles.id}>{user.email || 'Account'}</Text><Text style={styles.location}>⌖  Area, City</Text><View style={styles.stats}><Text><Text style={styles.statOrange}>0 </Text>Followers</Text><Text><Text style={styles.statOrange}>0.0 </Text>Ratings(0)</Text><Text><Text style={styles.statOrange}>0 </Text>Following</Text></View><Text style={styles.bio}>No bio yet. Tell others about yourself</Text></View>
      <Text style={styles.groupTitle}>ACCOUNT</Text><MenuCard items={accountItems} />
      <Text style={styles.groupTitle}>SUPPORT & APP</Text><MenuCard items={supportItems} />
      <Text style={styles.groupTitle}>ABOUT</Text><MenuCard items={aboutItems} />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Pressable disabled={isSubmitting} onPress={onLogout} style={[styles.logout, isSubmitting && styles.disabled]}>{isSubmitting ? <ActivityIndicator color="#F22" /> : <><Text style={styles.logoutIcon}>⇥</Text><Text style={styles.logoutText}>Log Out</Text></>}</Pressable>
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF8F5' }, content: { paddingBottom: 100 },
  header: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F45100' }, headerTitle: { color: '#FFF', fontSize: 23, fontWeight: '700' }, share: { position: 'absolute', right: 18, color: '#FFF', fontSize: 27 },
  profile: { alignItems: 'center', backgroundColor: '#FFF', paddingVertical: 23 }, avatar: { width: 94, height: 94, alignItems: 'center', justifyContent: 'center', borderRadius: 47, backgroundColor: '#514B4B', borderWidth: 3, borderColor: '#FFF', elevation: 2 }, avatarText: { color: '#FFF', fontSize: 40 }, name: { color: '#111', fontSize: 25, fontWeight: '700', marginTop: 12 }, id: { color: '#999', fontSize: 13, marginTop: 4 }, location: { color: '#666', fontSize: 14, marginTop: 12 }, stats: { width: '100%', flexDirection: 'row', justifyContent: 'space-around', color: '#555', fontSize: 13, marginTop: 18 }, statOrange: { color: '#F1645E', fontWeight: '700' }, bio: { color: '#777', fontSize: 13, marginTop: 18 },
  groupTitle: { color: '#999', fontSize: 13, fontWeight: '700', marginTop: 18, marginBottom: 8, marginLeft: 18 }, menuCard: { marginHorizontal: 14, borderRadius: 15, backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 5 }, menuItem: { minHeight: 58, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }, menuIcon: { color: '#F45100', fontSize: 24, width: 35 }, menuLabel: { flex: 1, color: '#222', fontSize: 15, fontWeight: '600' }, arrow: { color: '#999', fontSize: 27 },
  error: { color: '#D22', fontSize: 12, textAlign: 'center', margin: 12 }, logout: { height: 56, flexDirection: 'row', alignItems: 'center', margin: 14, paddingHorizontal: 20, borderRadius: 15, backgroundColor: '#FFF', elevation: 3 }, logoutIcon: { color: '#F22', fontSize: 25, marginRight: 15 }, logoutText: { color: '#F22', fontSize: 17, fontWeight: '700' }, disabled: { opacity: 0.6 },
});
