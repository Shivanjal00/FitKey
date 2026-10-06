// src/screens/FavoritesScreen.tsx
import { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { useAsync } from '../lib/useAsync';
import { useFavorites } from '../store/FavoritesContext';
import { getGymsByIds } from '../services/firebase/gyms.service';
import GymCardRow from '../components/GymCardRow';
import type { TabScreenProps } from '../navigation/TabNavigator';

type Props = TabScreenProps<'Favorites'>;

export default function FavoritesScreen({ navigation }: Props) {
  const insets = useSafeInsets();
  const { favorites } = useFavorites();
  const ids = useMemo(() => Array.from(favorites), [favorites]);
  const { data: favoriteGyms, loading } = useAsync(
    () => getGymsByIds(ids),
    [ids.join(',')],
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Favorites</Text>
      <Text style={styles.sectionLabel}>
        Saved gyms · {favoriteGyms?.length ?? 0}
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 20 }} />
      ) : favoriteGyms && favoriteGyms.length > 0 ? (
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
});
