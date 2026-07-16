// src/screens/SearchScreen.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Search as SearchIcon,
  Mic,
  Clock,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { GYMS, FILTERS } from '../data/gyms';
import GymCardRow from '../components/GymCardRow';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const RECENTS = ['CrossFit near me', 'Yoga studios', 'Women only gyms'];

export default function SearchScreen({ navigation }: Props) {
  const insets = useSafeInsets();
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const toggleFilter = (f: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  };

  const results = query.trim()
    ? GYMS.filter(g =>
        g.name.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : GYMS;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={18} color={colors.foreground} strokeWidth={2} />
        </Pressable>
        <View style={styles.searchBar}>
          <SearchIcon size={17} color={colors.mutedForeground} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search gyms, activities..."
            placeholderTextColor={`${colors.mutedForeground}99`}
            style={styles.searchInput}
          />
          <Mic size={17} color={colors.mutedForeground} />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map(f => {
          const active = activeFilters.has(f);
          return (
            <Pressable
              key={f}
              onPress={() => toggleFilter(f)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {f}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {!query.trim() && (
          <>
            <Text style={styles.sectionLabel}>Recent searches</Text>
            {RECENTS.map(r => (
              <Pressable
                key={r}
                style={styles.recentRow}
                onPress={() => setQuery(r)}
              >
                <Clock size={15} color={colors.mutedForeground} />
                <Text style={styles.recentText}>{r}</Text>
              </Pressable>
            ))}
          </>
        )}

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
          {query.trim() ? `Results for "${query.trim()}"` : 'Trending near you'}
        </Text>
        <View style={{ gap: 12 }}>
          {results.map(gym => (
            <GymCardRow
              key={gym.id}
              gym={gym}
              onPress={() =>
                navigation.navigate('GymDetails', { gymId: gym.id })
              }
            />
          ))}
          {query.trim() && results.length === 0 && (
            <Text style={styles.emptyText}>No gyms match "{query.trim()}"</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.foreground,
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 44,
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: font.regular,
    color: colors.foreground,
    padding: 0,
  },
  filterRow: { gap: 8, paddingHorizontal: 20, paddingBottom: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.foreground,
    borderColor: colors.foreground,
  },
  chipText: {
    fontSize: 12.5,
    fontFamily: font.medium,
    color: colors.foreground,
  },
  chipTextActive: { color: colors.primaryForeground },
  content: { flex: 1, paddingHorizontal: 20 },
  sectionLabel: {
    fontSize: 12.5,
    fontFamily: font.semibold,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  recentText: {
    fontSize: 14,
    fontFamily: font.regular,
    color: colors.foreground,
  },
  emptyText: {
    fontSize: 13.5,
    fontFamily: font.regular,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 24,
  },
});
