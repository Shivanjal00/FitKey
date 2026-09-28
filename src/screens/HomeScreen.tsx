// screens/HomeScreen.tsx
import { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserLocation } from '../store/UserLocationContext';
import { withComputedDistance } from '../services/location.service';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Bell,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import GymCardGrid from '../components/GymCardGrid';
import { useFavorites } from '../store/FavoritesContext';

const PASS_TYPE_CHIPS = new Set(['Daily Pass', 'Monthly Pass']);

// Add these imports
import { doc, getDoc } from '@react-native-firebase/firestore';
import { db, authInstance } from '../services/firebase';

import { ActivityIndicator } from 'react-native'; // Text already imported, ActivityIndicator is new
import { getGyms } from '../services/firebase/gyms.service';
import { useAsync } from '../lib/useAsync';
// REMOVE: import { GYMS, CATEGORIES } from '../data/gyms';
import { CATEGORIES } from '../data/gyms'; // CATEGORIES stays as a local constant — it's UI config, not data

export default function HomeScreen() {
  const insets = useSafeInsets();
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const { favorites, toggleFavorite } = useFavorites();
  const { data: gyms, loading } = useAsync(getGyms);
  const {
    coords,
    address,
    loading: locationLoading,
    permissionDenied,
  } = useUserLocation();

  const { data: profile } = useAsync(async () => {
    const uid = authInstance.currentUser?.uid;
    if (!uid) return null;
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? (snap.data() as { address?: string }) : null;
  }, []);

  const openGym = (id: string) =>
    navigation.navigate('GymDetails', { gymId: id });

  const filteredGyms = useMemo(() => {
    if (!gyms) return [];
    const base = PASS_TYPE_CHIPS.has(activeCategory)
      ? gyms
      : gyms.filter(g => g.category === activeCategory);
    return withComputedDistance(base, coords);
  }, [activeCategory, gyms, coords]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning, Aarav</Text>
          <Pressable style={styles.locationRow}>
            <Text style={styles.location}>
              {permissionDenied
                ? profile?.address ?? 'Enable location'
                : locationLoading
                ? profile?.address ?? 'Finding you…'
                : address ?? profile?.address ?? 'Location unavailable'}
            </Text>
            <ChevronDown size={16} color={colors.foreground} />
          </Pressable>
        </View>
        <Pressable
          style={styles.bellButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Bell size={20} color={colors.foreground} />
          <View style={styles.bellDot} />
        </Pressable>
      </View>

      <Pressable
        style={styles.searchBar}
        onPress={() => navigation.navigate('Search')}
      >
        <Search size={18} color={colors.mutedForeground} />
        <Text style={styles.searchPlaceholder}>
          Search gyms, yoga, CrossFit...
        </Text>
        <SlidersHorizontal size={18} color={colors.mutedForeground} />
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
      >
        {CATEGORIES.map(cat => {
          const active = cat === activeCategory;
          return (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Gyms near you</Text>
        <Text style={styles.resultCount}>{filteredGyms.length} found</Text>
      </View>

      {filteredGyms.length > 0 ? (
        <View style={styles.grid}>
          {filteredGyms.map(gym => (
            <GymCardGrid
              key={gym.id}
              gym={gym}
              favorite={favorites.has(gym.id)}
              onToggleFavorite={() => toggleFavorite(gym.id)}
              onPress={() => openGym(gym.id)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No gyms found in this category yet.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 13,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  location: { fontSize: 15, fontFamily: font.bold, color: colors.foreground },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.error,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 20,
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  categoriesRow: { gap: 8, paddingHorizontal: 20, paddingTop: 20 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 13, fontFamily: font.medium, color: colors.foreground },
  chipTextActive: { color: colors.primaryForeground },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: font.bold,
    color: colors.foreground,
  },
  resultCount: {
    fontSize: 12.5,
    fontFamily: font.medium,
    color: colors.mutedForeground,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    paddingHorizontal: 20,
  },
  emptyState: { paddingHorizontal: 20, paddingTop: 20, alignItems: 'center' },
  emptyText: {
    fontSize: 13.5,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
});
