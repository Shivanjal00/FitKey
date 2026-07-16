// screens/HomeScreen.tsx
import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Bell,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { GYMS, CATEGORIES } from '../data/gyms';
import GymCard from '../components/GymCard';
import GymCardCompact from '../components/GymCardCompact';
import { useFavorites } from '../store/FavoritesContext';

export default function HomeScreen() {
  const insets = useSafeInsets();
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const { favorites, toggleFavorite } = useFavorites();

  const openGym = (id: string) =>
    navigation.navigate('GymDetails', { gymId: id });

  const nearby = GYMS.slice(0, 4);
  const featured = GYMS.slice(1, 3);
  const popular = [...GYMS].sort((a, b) => b.reviews - a.reviews).slice(0, 4);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning, Aarav</Text>
          <Pressable style={styles.locationRow}>
            <Text style={styles.location}>Sector 29, Gurugram</Text>
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

      {/* Search bar */}
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

      {/* Categories */}
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

      {/* Nearby gyms */}
      <SectionHeader
        title="Nearby gyms"
        onSeeAll={() => navigation.navigate('Search')}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScroll}
      >
        {nearby.map(gym => (
          <GymCardCompact
            key={gym.id}
            gym={gym}
            onPress={() => openGym(gym.id)}
          />
        ))}
      </ScrollView>

      {/* Featured gyms */}
      <SectionHeader
        title="Featured gyms"
        onSeeAll={() => navigation.navigate('Search')}
      />
      <View style={styles.vList}>
        {featured.map(gym => (
          <GymCard
            key={gym.id}
            gym={gym}
            favorite={favorites.has(gym.id)}
            onToggleFavorite={() => toggleFavorite(gym.id)}
            onPress={() => openGym(gym.id)}
          />
        ))}
      </View>

      {/* Popular today */}
      <SectionHeader title="Popular today" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScroll}
      >
        {popular.map(gym => (
          <GymCardCompact
            key={gym.id}
            gym={gym}
            onPress={() => openGym(gym.id)}
          />
        ))}
      </ScrollView>
    </ScrollView>
  );
}

function SectionHeader({
  title,
  onSeeAll,
}: {
  title: string;
  onSeeAll?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      )}
    </View>
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
  seeAll: { fontSize: 13, fontFamily: font.semibold, color: colors.accent },
  hScroll: { gap: 12, paddingHorizontal: 20 },
  vList: { gap: 12, paddingHorizontal: 20 },
});
