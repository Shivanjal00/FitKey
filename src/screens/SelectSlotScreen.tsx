// screens/SelectSlotScreen.tsx
import { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { GYMS } from '../data/gyms';
import SegmentedControl from '../components/SegmentedControl';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectSlot'>;

const SEGMENTS = ['Morning', 'Afternoon', 'Evening', 'Night'];

const SLOTS_BY_SEGMENT: Record<string, string[]> = {
  Morning: ['5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM'],
  Afternoon: [
    '12:00 PM',
    '12:30 PM',
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '2:30 PM',
  ],
  Evening: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM'],
  Night: ['8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM'],
};

function buildDays() {
  const labels = ['Today', 'Tomorrow'];
  const days = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    days.push({
      top: i < 2 ? labels[i] : weekday,
      bottom: i < 2 ? '' : String(dayNum),
    });
  }
  return days;
}

export default function SelectSlotScreen({ route, navigation }: Props) {
  const insets = useSafeInsets();
  const { gymId, planIndex } = route.params;
  const gym = GYMS.find(g => g.id === gymId) ?? GYMS[0];
  const days = useMemo(buildDays, []);

  const [dateIndex, setDateIndex] = useState(0);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);

  const slots = SLOTS_BY_SEGMENT[SEGMENTS[segmentIndex]];

  const selectDate = (i: number) => {
    setDateIndex(i);
    setSlot(null);
  };
  const selectSegment = (i: number) => {
    setSegmentIndex(i);
    setSlot(null);
  };

  const onContinue = () => {
    if (!slot) return;
    navigation.navigate('BookingSummary', { gymId, planIndex, slot });
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
        <Text style={styles.title}>Select slot</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          {gym.name} · {gym.plans[planIndex].name}
        </Text>

        <Text style={styles.label}>Choose date</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateRow}
        >
          {days.map((day, i) => {
            const active = i === dateIndex;
            return (
              <Pressable
                key={i}
                onPress={() => selectDate(i)}
                style={[styles.dateChip, active && styles.dateChipActive]}
              >
                <Text style={[styles.dateTop, active && styles.dateTextActive]}>
                  {day.top}
                </Text>
                {day.bottom !== '' && (
                  <Text
                    style={[styles.dateBottom, active && styles.dateTextActive]}
                  >
                    {day.bottom}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={[styles.label, { marginTop: 24 }]}>Time of day</Text>
        <View style={{ marginTop: 10 }}>
          <SegmentedControl
            options={SEGMENTS}
            selectedIndex={segmentIndex}
            onChange={selectSegment}
          />
        </View>

        <View style={styles.slotGrid}>
          {slots.map(s => {
            const active = s === slot;
            return (
              <Pressable
                key={s}
                onPress={() => setSlot(s)}
                style={[styles.slotChip, active && styles.slotChipActive]}
              >
                <Text
                  style={[styles.slotText, active && styles.slotTextActive]}
                >
                  {s}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={[styles.ctaWrap, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <Pressable
          onPress={onContinue}
          disabled={!slot}
          style={[styles.cta, !slot && styles.ctaDisabled]}
        >
          <Text style={styles.ctaText}>
            {slot ? `Continue with ${slot}` : 'Select a time slot'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
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
  content: { flex: 1, paddingHorizontal: 20 },
  subtitle: {
    marginTop: 12,
    fontSize: 13,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  label: {
    marginTop: 20,
    fontSize: 13,
    fontFamily: font.semibold,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  dateRow: { gap: 10, marginTop: 10, paddingBottom: 4 },
  dateChip: {
    width: 64,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  dateChipActive: {
    backgroundColor: colors.foreground,
    borderColor: colors.foreground,
  },
  dateTop: {
    fontSize: 11,
    fontFamily: font.medium,
    color: colors.mutedForeground,
  },
  dateBottom: {
    fontSize: 14,
    fontFamily: font.bold,
    color: colors.foreground,
    marginTop: 2,
  },
  dateTextActive: { color: colors.primaryForeground },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
    paddingBottom: 24,
  },
  slotChip: {
    width: '31%',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  slotChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  slotText: {
    fontSize: 13,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  slotTextActive: { color: colors.primaryForeground },
  ctaWrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  cta: {
    backgroundColor: colors.foreground,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaDisabled: { backgroundColor: colors.borderStrong },
  ctaText: {
    fontSize: 15,
    fontFamily: font.semibold,
    color: colors.primaryForeground,
  },
});
