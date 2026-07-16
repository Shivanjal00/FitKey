// src/screens/BookingSummaryScreen.tsx
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { GYMS } from '../data/gyms';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingSummary'>;

const PLATFORM_FEE = 19;

export default function BookingSummaryScreen({ route, navigation }: Props) {
  const insets = useSafeInsets();
  const { gymId, planIndex, slot } = route.params;
  const gym = GYMS.find(g => g.id === gymId) ?? GYMS[0];
  const plan = gym.plans[planIndex];
  const total = plan.price + PLATFORM_FEE;

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
          <Row label="Date" value="Fri, 18 Jul 2026" />
          <Divider />
          <Row label="Time" value={slot} />
        </View>

        <Text style={styles.sectionLabel}>Price details</Text>
        <View style={styles.card}>
          <Row label={plan.name} value={`₹${plan.price}`} />
          <Divider />
          <Row label="Platform fee" value={`₹${PLATFORM_FEE}`} />
          <Divider />
          <Row label="Total" value={`₹${total}`} bold />
        </View>
      </View>

      <View
        style={[styles.ctaWrap, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <Pressable
          style={styles.cta}
          onPress={() =>
            navigation.navigate('Payment', { gymId, planIndex, slot, total })
          }
        >
          <Text style={styles.ctaText}>Proceed to Pay · ₹{total}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.rowLabelBold]}>
        {label}
      </Text>
      <Text style={[styles.rowValue, bold && styles.rowValueBold]}>
        {value}
      </Text>
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
  rowLabelBold: {
    fontFamily: font.bold,
    color: colors.foreground,
    fontSize: 14,
  },
  rowValue: {
    fontSize: 13.5,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  rowValueBold: { fontFamily: font.bold, fontSize: 16 },
  rowDivider: { height: 1, backgroundColor: colors.border },
  sectionLabel: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 13,
    fontFamily: font.semibold,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
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
