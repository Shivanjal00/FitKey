// components/GymCardCompact.tsx
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import type { Gym } from '../data/gyms';

export default function GymCardCompact({
  gym,
  onPress,
}: {
  gym: Gym;
  onPress: () => void;
}) {
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
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {gym.name}
      </Text>
      <Text style={styles.meta}>
        {gym.distance} · ₹{gym.price}/day
      </Text>
    </Pressable>
    //· ₹{gym.price}/day
  );
}

const styles = StyleSheet.create({
  card: { width: 160 },
  imageWrap: { height: 112, width: 160, borderRadius: 16, overflow: 'hidden' },
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
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  ratingText: {
    fontSize: 10,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  name: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  meta: {
    fontSize: 12,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
});
