// src/screens/ProfileScreen.tsx
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useCallback, useState } from 'react';
import {
  CalendarCheck,
  Heart,
  Bell,
  LifeBuoy,
  ShieldCheck,
  FileText,
  Pencil,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { useAsync } from '../lib/useAsync';
import { useFavorites } from '../store/FavoritesContext';
import { authInstance } from '../services/firebase';
import { getDocument } from '../services/firebase/firestore.service';
import { signOutUser } from '../services/firebase/auth.service';
import type { UserProfile } from '../types/firestore.types';
import type { TabScreenProps } from '../navigation/TabNavigator';

type Props = TabScreenProps<'Profile'>;

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=300&q=80';

const MENU = [
  { icon: CalendarCheck, label: 'Bookings', action: 'bookings' as const },
  { icon: Heart, label: 'Favorites', action: 'favorites' as const },
  { icon: Bell, label: 'Notifications', action: 'notifications' as const }, // was 'none'
  { icon: LifeBuoy, label: 'Support', action: 'none' as const },
  { icon: ShieldCheck, label: 'Privacy Policy', action: 'none' as const },
  { icon: FileText, label: 'Terms', action: 'none' as const },
];

export default function ProfileScreen({ navigation }: Props) {
  const insets = useSafeInsets();
  const { favorites } = useFavorites();
  const [loggingOut, setLoggingOut] = useState(false);

  // This screen only ever mounts inside MainTabs, which is only reachable
  // once Splash/Login has confirmed a signed-in user — so currentUser
  // should always be set here. We still fall back gracefully (rather than
  // crash) in the unlikely case the session drops between screens.
  const currentUser = authInstance.currentUser;
  const uid = currentUser?.uid ?? null;

  // Bumped every time this screen regains focus so returning from
  // EditProfile (or anywhere else that might change the doc) picks up
  // fresh data without a manual refresh affordance.
  const [refreshKey, setRefreshKey] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setRefreshKey(k => k + 1);
    }, []),
  );

  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useAsync<UserProfile | null>(
    () =>
      uid ? getDocument<UserProfile>('users', uid) : Promise.resolve(null),
    [uid, refreshKey],
  );

  // Firestore profile doc wins when present; fall back to whatever the
  // Firebase Auth user object already has (covers the brief window before
  // the doc has loaded).
  const displayName =
    profile?.displayName || currentUser?.displayName || 'FitKey User';
  const email = profile?.email ?? currentUser?.email ?? null;
  const avatarUri =
    profile?.photoURL || currentUser?.photoURL || FALLBACK_AVATAR;
  const tier = profile?.tier ?? 'Standard';
  const bookingsCount = profile?.bookingsCount ?? 0;
  const showSkeleton = profileLoading && !profile;

  const onMenuPress = (
    action: 'bookings' | 'favorites' | 'notifications' | 'none',
  ) => {
    if (action === 'bookings') navigation.navigate('Bookings');
    if (action === 'favorites') navigation.navigate('Favorites');
    if (action === 'notifications') navigation.navigate('Notifications');
  };

  const performLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await signOutUser();
      // Reset (not navigate) so Login becomes the only stack entry —
      // otherwise the hardware/back gesture could return to MainTabs
      // even though the user is now signed out.
      navigation.getParent()?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        }),
      );
      // Deliberately no `finally` setLoggingOut(false) on the success path
      // — this screen is about to be unmounted by the reset, so there's
      // nothing left to show a spinner on.
    } catch (err) {
      setLoggingOut(false);
      Alert.alert(
        'Logout failed',
        'Please check your connection and try again.',
      );
    }
  };

  const onLogoutPress = () => {
    Alert.alert('Log out?', 'You can always sign back in.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: performLogout },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileRow}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          {showSkeleton ? (
            <>
              <View style={[styles.skeletonBar, { width: '55%' }]} />
              <View
                style={[
                  styles.skeletonBar,
                  { width: '75%', marginTop: 6, height: 12 },
                ]}
              />
            </>
          ) : (
            <>
              <Text style={styles.name} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={styles.email} numberOfLines={1}>
                {email ?? 'No email on file'}
              </Text>
            </>
          )}
        </View>
        <Pressable
          style={[styles.editButton, showSkeleton && { opacity: 0.4 }]}
          onPress={() =>
            navigation.navigate('EditProfile', {
              displayName,
              photoURL: profile?.photoURL ?? currentUser?.photoURL ?? null,
            })
          }
          disabled={showSkeleton}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
        >
          <Pencil size={16} color={colors.foreground} />
        </Pressable>
      </View>

      {profileError ? (
        <Text style={styles.profileErrorText}>
          Couldn't load your latest profile details — showing what we have.
        </Text>
      ) : null}

      <View style={styles.statsRow}>
        <StatCard
          value={showSkeleton ? '—' : String(bookingsCount)}
          label="Bookings"
        />
        <StatCard value={String(favorites.size)} label="Favorites" />
        <StatCard value={showSkeleton ? '—' : tier} label="Tier" />
      </View>

      <View style={styles.menuCard}>
        {MENU.map((item, i) => (
          <Pressable
            key={item.label}
            onPress={() => onMenuPress(item.action)}
            style={[
              styles.menuRow,
              i < MENU.length - 1 && styles.menuRowBorder,
            ]}
          >
            <item.icon size={18} color={colors.foreground} strokeWidth={1.8} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <ChevronRight size={16} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.logoutButton, loggingOut && { opacity: 0.6 }]}
        onPress={onLogoutPress}
        disabled={loggingOut}
        accessibilityRole="button"
        accessibilityLabel="Log out"
      >
        {loggingOut ? (
          <ActivityIndicator size="small" color={colors.error} />
        ) : (
          <LogOut size={17} color={colors.error} />
        )}
        <Text style={styles.logoutText}>
          {loggingOut ? 'Logging out…' : 'Logout'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  name: { fontSize: 18, fontFamily: font.bold, color: colors.foreground },
  email: {
    fontSize: 13,
    fontFamily: font.regular,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  skeletonBar: {
    height: 16,
    borderRadius: 6,
    backgroundColor: colors.border,
  },
  profileErrorText: {
    marginTop: 10,
    marginHorizontal: 20,
    fontSize: 12,
    fontFamily: font.regular,
    color: colors.warn,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: { fontSize: 17, fontFamily: font.bold, color: colors.foreground },
  statLabel: {
    fontSize: 11,
    fontFamily: font.regular,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  menuCard: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuLabel: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: font.medium,
    color: colors.foreground,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
  },
  logoutText: { fontSize: 14, fontFamily: font.semibold, color: colors.error },
});
