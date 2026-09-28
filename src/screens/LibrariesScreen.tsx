// src/screens/LibrariesScreen.tsx
import { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { useAsync } from '../lib/useAsync';
import { getLibraries } from '../services/firebase/libraries.service';
import LibraryCardGrid from '../components/LibraryCardGrid';
import type { TabScreenProps } from '../navigation/TabNavigator';
import { useUserLocation } from '../store/UserLocationContext';
import { withComputedDistance } from '../services/location.service';

type Props = TabScreenProps<'Libraries'>;

const LIBRARY_FILTERS = [
  'All',
  'Silent Study',
  '24x7',
  'Coworking',
  'Exam Prep',
  'Wi-Fi',
];

export default function LibrariesScreen({ navigation }: Props) {
  const insets = useSafeInsets();
  const [activeFilter, setActiveFilter] = useState('All');
  const { data: libraries, loading } = useAsync(getLibraries);
  const { coords } = useUserLocation();

  const filtered = useMemo(() => {
    if (!libraries) return [];
    const base =
      activeFilter === 'All'
        ? libraries
        : libraries.filter(lib => lib.tags.includes(activeFilter));
    return withComputedDistance(base, coords);
  }, [activeFilter, libraries, coords]);

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
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
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            Bengaluru · {libraries?.length ?? 0} reading rooms
          </Text>
        </View>
        <Text style={styles.title}>Quiet rooms for long, deep work.</Text>
        <Text style={styles.subtitle}>
          Silent libraries, 24×7 study lofts and coworking reading rooms —
          vetted for Wi-Fi, seating and vibe. Unlock by the hour, day or month.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {LIBRARY_FILTERS.map(f => {
          const active = f === activeFilter;
          return (
            <Pressable
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {f}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Reading rooms</Text>
        <Text style={styles.resultCount}>{filtered.length} found</Text>
      </View>

      {filtered.length > 0 ? (
        <View style={styles.grid}>
          {filtered.map(lib => (
            <LibraryCardGrid
              key={lib.id}
              library={lib}
              onPress={() =>
                navigation.navigate('LibraryDetails', { libraryId: lib.id })
              }
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No reading rooms match this filter yet.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: { paddingHorizontal: 20 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: `${colors.accent}14`,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11.5,
    fontFamily: font.semibold,
    color: colors.accent,
  },
  title: {
    marginTop: 14,
    fontSize: 24,
    lineHeight: 30,
    fontFamily: font.bold,
    color: colors.foreground,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13.5,
    lineHeight: 20,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  filterRow: { gap: 8, paddingHorizontal: 20, paddingTop: 22 },
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
    marginTop: 24,
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
