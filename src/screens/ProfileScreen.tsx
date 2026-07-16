// src/screens/ProfileScreen.tsx
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
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
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { useFavorites } from '../store/FavoritesContext';
import type { TabScreenProps } from '../navigation/TabNavigator';

type Props = TabScreenProps<'Profile'>;

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

  const onMenuPress = (
    action: 'bookings' | 'favorites' | 'notifications' | 'none',
  ) => {
    if (action === 'bookings') navigation.navigate('Bookings');
    if (action === 'favorites') navigation.navigate('Favorites');
    if (action === 'notifications') navigation.navigate('Notifications');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileRow}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=300&q=80',
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Aarav Sharma</Text>
          <Text style={styles.phone}>+91 98765 43210</Text>
        </View>
        <Pressable style={styles.editButton}>
          <Pencil size={16} color={colors.foreground} />
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <StatCard value="12" label="Bookings" />
        <StatCard value={String(favorites.size)} label="Favorites" />
        <StatCard value="Gold" label="Tier" />
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
        style={styles.logoutButton}
        onPress={() => navigation.getParent()?.navigate('Login')}
      >
        <LogOut size={17} color={colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
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
  avatar: { width: 64, height: 64, borderRadius: 999 },
  name: { fontSize: 18, fontFamily: font.bold, color: colors.foreground },
  phone: {
    fontSize: 13,
    fontFamily: font.regular,
    color: colors.mutedForeground,
    marginTop: 2,
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
