// src/screens/BookingSummaryScreen.tsx
import { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { useAsync } from '../lib/useAsync';
import { getGymById } from '../services/firebase/gyms.service';
import { createBooking } from '../services/firebase/bookings.service';
import { authInstance } from '../services/firebase';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingSummary'>;

export default function BookingSummaryScreen({ route, navigation }: Props) {
  const insets = useSafeInsets();
  const { gymId, planIndex, slot, dateISO } = route.params;
  const { data: gym, loading } = useAsync(() => getGymById(gymId), [gymId]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (loading || !gym) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  const plan = gym.plans[planIndex];
  const slotDate = new Date(dateISO);
  const dateLabel = slotDate.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleConfirm = async () => {
    const uid = authInstance.currentUser?.uid;
    if (!uid) return;
    setErrorMsg('');
    setSubmitting(true);
    try {
      const bookingId = await createBooking({
        userId: uid,
        gymId: gym.id,
        gymNameSnapshot: gym.name,
        gymImageSnapshot: gym.image,
        planName: plan.name,
        slotDate,
        slotTime: slot,
      });
      navigation.replace('BookingStatus', { bookingId });
    } catch {
      setErrorMsg('Could not confirm your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={18} color={colors.foreground} strokeWidth={2} />
        </Pressable>
        <Text style={styles.title}>Booking summary</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.gymRow}>
          <Image source={{ uri: gym.image }} style={styles.gymImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.gymName}>{gym.name}</Text>
            <Text style={styles.gymArea}>{gym.area}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Row label="Membership" value={plan.name} />
          <Divider />
          <Row label="Date" value={dateLabel} />
          <Divider />
          <Row label="Time" value={slot} />
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      </View>

      <View
        style={[styles.ctaWrap, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <Pressable
          style={styles.cta}
          onPress={handleConfirm}
          disabled={submitting}
        >
          <Text style={styles.ctaText}>
            {submitting ? 'Confirming…' : 'Confirm Booking'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}
function Divider() {
  return <View style={styles.rowDivider} />;
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 8,
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
  title: { fontSize: 17, fontFamily: font.bold, color: colors.foreground },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  gymRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  gymImage: { width: 64, height: 64, borderRadius: 16 },
  gymName: {
    fontSize: 14.5,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  gymArea: {
    marginTop: 2,
    fontSize: 12.5,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  card: {
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 13.5,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  rowValue: {
    fontSize: 13.5,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  rowDivider: { height: 1, backgroundColor: colors.border },
  errorText: {
    marginTop: 16,
    fontSize: 12.5,
    fontFamily: font.medium,
    color: colors.error,
    textAlign: 'center',
  },
  ctaWrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 15,
    fontFamily: font.semibold,
    color: colors.primaryForeground,
  },
});
