// src/screens/FavoritesScreen.tsx
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { GYMS } from '../data/gyms';
import { useFavorites } from '../store/FavoritesContext';
import GymCardRow from '../components/GymCardRow';
import GymCardCompact from '../components/GymCardCompact';
import type { TabScreenProps } from '../navigation/TabNavigator';

type Props = TabScreenProps<'Favorites'>;

const COLLECTIONS = ['Weekend picks', 'Close to work', 'Best rated'];

export default function FavoritesScreen({ navigation }: Props) {
  const insets = useSafeInsets();
  const { favorites } = useFavorites();
  const favoriteGyms = GYMS.filter(g => favorites.has(g.id));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Favorites</Text>

      <Text style={styles.sectionLabel}>Collections</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.collectionsRow}
      >
        {COLLECTIONS.map(c => (
          <View key={c} style={styles.collectionChip}>
            <Text style={styles.collectionText}>{c}</Text>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.sectionLabel}>
        Saved gyms · {favoriteGyms.length}
      </Text>
      {favoriteGyms.length > 0 ? (
        <View style={styles.savedList}>
          {favoriteGyms.map(gym => (
            <GymCardRow
              key={gym.id}
              gym={gym}
              onPress={() =>
                navigation.navigate('GymDetails', { gymId: gym.id })
              }
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Heart size={32} color={colors.borderStrong} />
          <Text style={styles.emptyTitle}>No saved gyms yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart on any gym to save it here.
          </Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>Recently viewed</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScroll}
      >
        {GYMS.slice(0, 4).map(gym => (
          <GymCardCompact
            key={gym.id}
            gym={gym}
            onPress={() => navigation.navigate('GymDetails', { gymId: gym.id })}
          />
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: font.bold,
    color: colors.foreground,
    marginHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: font.semibold,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 10,
  },
  collectionsRow: { gap: 8, paddingHorizontal: 20 },
  collectionChip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  collectionText: {
    fontSize: 12.5,
    fontFamily: font.medium,
    color: colors.foreground,
  },
  savedList: { gap: 12, paddingHorizontal: 20 },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 8,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 14,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  emptySubtitle: {
    fontSize: 12.5,
    fontFamily: font.regular,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  hScroll: { gap: 12, paddingHorizontal: 20 },
});
