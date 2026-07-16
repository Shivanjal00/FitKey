// src/components/GymCardRow.tsx
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import type { Gym } from '../data/gyms';

export default function GymCardRow({
  gym,
  onPress,
}: {
  gym: Gym;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: gym.image }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {gym.name}
          </Text>
          <View style={styles.ratingRow}>
            <Star size={12} color={colors.warn} fill={colors.warn} />
            <Text style={styles.ratingText}>{gym.rating}</Text>
          </View>
        </View>
        <Text style={styles.area}>
          {gym.area} · {gym.distance}
        </Text>
        <View style={styles.footerRow}>
          <Text style={styles.price}>
            ₹{gym.price}
            <Text style={styles.priceUnit}>/day</Text>
          </Text>
          <Text
            style={[
              styles.status,
              { color: gym.open ? colors.success : colors.mutedForeground },
            ]}
          >
            {gym.open ? 'Open now' : 'Closed'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  image: { width: 80, height: 80, borderRadius: 16 },
  info: { flex: 1, justifyContent: 'center' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 14,
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
    marginTop: 2,
    fontSize: 12.5,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: { fontSize: 13, fontFamily: font.bold, color: colors.foreground },
  priceUnit: {
    fontSize: 11,
    fontFamily: font.medium,
    color: colors.mutedForeground,
  },
  status: { fontSize: 12, fontFamily: font.semibold },
});
