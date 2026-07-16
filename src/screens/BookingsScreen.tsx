// src/screens/BookingsScreen.tsx
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { BOOKINGS, BookingStatus } from '../data/bookings';
import { GYMS } from '../data/gyms';
import BookingCard from '../components/BookingCard';
import SegmentedControl from '../components/SegmentedControl';
import type { TabScreenProps } from '../navigation/TabNavigator';

type Props = TabScreenProps<'Bookings'>;

const TABS: BookingStatus[] = ['upcoming', 'completed', 'cancelled'];
const TAB_LABELS = ['Upcoming', 'Completed', 'Cancelled'];

export default function BookingsScreen({ navigation }: Props) {
  const insets = useSafeInsets();
  const [tabIndex, setTabIndex] = useState(0);
  const activeStatus = TABS[tabIndex];

  const filtered = BOOKINGS.filter(b => b.status === activeStatus);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>My Bookings</Text>
        <View style={{ marginTop: 16 }}>
          <SegmentedControl
            options={TAB_LABELS}
            selectedIndex={tabIndex}
            onChange={setTabIndex}
          />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
      >
        {filtered.length === 0 && (
          <Text style={styles.emptyText}>No {activeStatus} bookings yet.</Text>
        )}
        {filtered.map(booking => {
          const gym = GYMS.find(g => g.id === booking.gymId) ?? GYMS[0];
          return (
            <BookingCard
              key={booking.id}
              booking={booking}
              gym={gym}
              onPress={() =>
                navigation.navigate('GymDetails', { gymId: gym.id })
              }
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20 },
  title: { fontSize: 22, fontFamily: font.bold, color: colors.foreground },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  emptyText: {
    fontSize: 13.5,
    fontFamily: font.regular,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 40,
  },
});
