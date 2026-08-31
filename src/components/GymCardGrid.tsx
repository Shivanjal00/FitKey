// src/components/GymCardGrid.tsx
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Heart, Star, MapPin } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import type { Gym } from '../data/gyms';

type Props = {
  gym: Gym;
  favorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
};

export default function GymCardGrid({
  gym,
  favorite,
  onToggleFavorite,
  onPress,
}: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: gym.image }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.ratingBadge}>
          <Star size={10} color={colors.warn} fill={colors.warn} />
          <Text style={styles.ratingText}>{gym.rating}</Text>
        </View>

        <Pressable
          onPress={onToggleFavorite}
          style={styles.favButton}
          hitSlop={8}
        >
          <Heart
            size={13}
            color={favorite ? colors.error : colors.foreground}
            fill={favorite ? colors.error : 'none'}
            strokeWidth={2}
          />
        </Pressable>

        <View style={styles.statusDot}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: gym.open
                  ? colors.success
                  : colors.mutedForeground,
              },
            ]}
          />
          <Text style={styles.statusText}>{gym.open ? 'Open' : 'Closed'}</Text>
        </View>

        {/* Distance gets its own fixed badge so it's never truncated by a long area name */}
        <View style={styles.distanceBadge}>
          <MapPin size={9} color={colors.foreground} />
          <Text style={styles.distanceText}>{gym.distance}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {gym.name}
        </Text>
        <Text style={styles.area} numberOfLines={1}>
          {gym.area}
        </Text>

        <Pressable onPress={onPress} style={styles.bookButton}>
          <Text style={styles.bookText}>Book Now</Text>
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
  favButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
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
  distanceBadge: {
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
  distanceText: {
    fontSize: 9.5,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  body: { padding: 10 },
  name: { fontSize: 13, fontFamily: font.semibold, color: colors.foreground },
  area: {
    marginTop: 2,
    fontSize: 11,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  bookButton: {
    marginTop: 10,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookText: {
    fontSize: 12.5,
    fontFamily: font.semibold,
    color: colors.primaryForeground,
  },
});
