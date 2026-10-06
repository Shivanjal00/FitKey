// src/components/BookingCard.tsx
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { QrCode } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import type { Booking, BookingStatus } from '../types/firestore.types';
import type { Gym } from '../types/firestore.types';

const BADGE: Record<
  BookingStatus,
  { label: string; bg: string; text: string }
> = {
  upcoming: {
    label: 'Confirmed',
    bg: `${colors.success}1A`,
    text: colors.success,
  },
  completed: {
    label: 'Completed',
    bg: `${colors.borderStrong}40`,
    text: colors.mutedForeground,
  },
  cancelled: {
    label: 'Cancelled',
    bg: `${colors.error}1A`,
    text: colors.error,
  },
};

export default function BookingCard({
  booking,
  gym,
  onPress,
}: {
  booking: Booking;
  gym: Gym;
  onPress: () => void;
}) {
  const badge = BADGE[booking.status];

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: gym.image }} style={styles.image} />
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>
              {gym.name}
            </Text>
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, { color: badge.text }]}>
                {badge.label}
              </Text>
            </View>
          </View>
          <Text style={styles.meta}>
            {booking.planName} ·{' '}
            {booking.slotDate.toDate().toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
            })}{' '}
            · {booking.slotTime}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.qrRow}>
          <View style={styles.qrIconWrap}>
            <QrCode size={16} color={colors.foreground} />
          </View>
          <Text style={styles.qrText}>
            {booking.status === 'upcoming'
              ? 'Entry pass ready'
              : booking.status === 'completed'
              ? 'Session complete'
              : 'Refund processed'}
          </Text>
        </View>
        <Pressable onPress={onPress}>
          <Text style={styles.viewDetails}>View Details</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  row: { flexDirection: 'row', gap: 12 },
  image: { width: 64, height: 64, borderRadius: 16 },
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
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 10.5, fontFamily: font.semibold },
  meta: {
    marginTop: 4,
    fontSize: 12.5,
    fontFamily: font.regular,
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
  qrRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qrIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: {
    fontSize: 12,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  viewDetails: {
    fontSize: 12.5,
    fontFamily: font.semibold,
    color: colors.accent,
  },
});
