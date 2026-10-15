// src/components/LibraryCardGrid.tsx
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Star, Users } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import type { Library } from '../types/firestore.types';
type Props = {
  library: Library;
  onPress: () => void;
};

export default function LibraryCardGrid({ library, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: library.image }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.ratingBadge}>
          <Star size={10} color={colors.warn} fill={colors.warn} />
          <Text style={styles.ratingText}>{library.rating}</Text>
        </View>

        <View style={styles.statusDot}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: library.open
                  ? colors.success
                  : colors.mutedForeground,
              },
            ]}
          />
          <Text style={styles.statusText}>
            {library.open ? 'Open' : 'Closed'}
          </Text>
        </View>

        {/* Seats gets its own fixed badge — same reasoning as the gym card's distance badge */}
        <View style={styles.seatsBadge}>
          <Users size={9} color={colors.foreground} />
          <Text style={styles.seatsBadgeText}>{library.seats}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {library.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {library.area} · {library.distance}
        </Text>
        <Text style={styles.hours} numberOfLines={1}>
          {library.hours}
        </Text>

        <Pressable onPress={onPress} style={styles.reserveButton}>
          <Text style={styles.reserveText}>Reserve Seat</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  imageWrap: { height: 108, width: '100%' },
  image: { width: '100%', height: '100%' },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  ratingText: {
    fontSize: 10,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  statusDot: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  dot: { width: 5, height: 5, borderRadius: 999 },
  statusText: {
    fontSize: 9.5,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  seatsBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  seatsBadgeText: {
    fontSize: 9.5,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  body: { padding: 10 },
  name: { fontSize: 13, fontFamily: font.semibold, color: colors.foreground },
  meta: {
    marginTop: 2,
    fontSize: 11,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  hours: {
    marginTop: 1,
    fontSize: 10.5,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  reserveButton: {
    marginTop: 10,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reserveText: {
    fontSize: 12.5,
    fontFamily: font.semibold,
    color: colors.primaryForeground,
  },
});
