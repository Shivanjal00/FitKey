// components/GymCard.tsx
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Heart, Star } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import type { Gym } from '../data/gyms';

type Props = {
  gym: Gym;
  favorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
};

export default function GymCard({
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
        <Pressable
          onPress={onToggleFavorite}
          style={styles.favButton}
          hitSlop={8}
        >
          <Heart
            size={16}
            color={favorite ? colors.error : colors.foreground}
            fill={favorite ? colors.error : 'none'}
            strokeWidth={2}
          />
        </Pressable>
        <View style={styles.statusPill}>
          <Text
            style={[
              styles.statusText,
              { color: gym.open ? colors.success : colors.mutedForeground },
            ]}
          >
            ● {gym.open ? 'Open now' : 'Closed'}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {gym.name}
          </Text>
          <View style={styles.ratingRow}>
            <Star size={13} color={colors.warn} fill={colors.warn} />
            <Text style={styles.ratingText}>{gym.rating}</Text>
          </View>
        </View>
        <Text style={styles.area}>
          {gym.area} · {gym.distance}
        </Text>

        <View style={styles.tagsRow}>
          {gym.tags.slice(0, 3).map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.startingLabel}>Starting from</Text>
            <Text style={styles.price}>
              ₹{gym.price}
              <Text style={styles.priceUnit}>/day</Text>
            </Text>
          </View>
          <Pressable onPress={onPress} style={styles.bookButton}>
            <Text style={styles.bookText}>Book Pass</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  imageWrap: { height: 160, width: '100%' },
  image: { width: '100%', height: '100%' },
  favButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  statusText: { fontSize: 11, fontFamily: font.semibold },
  body: { padding: 16 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 15,
    lineHeight: 19,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: {
    fontSize: 13,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  area: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  tag: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    fontFamily: font.medium,
    color: colors.mutedForeground,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  startingLabel: {
    fontSize: 11,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  price: { fontSize: 17, fontFamily: font.bold, color: colors.foreground },
  priceUnit: {
    fontSize: 12,
    fontFamily: font.medium,
    color: colors.mutedForeground,
  },
  bookButton: {
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bookText: {
    fontSize: 13,
    fontFamily: font.semibold,
    color: colors.primaryForeground,
  },
});
