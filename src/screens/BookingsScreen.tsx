// src/screens/BookingsScreen.tsx
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { authInstance } from '../services/firebase';
import { subscribeToUserBookings } from '../services/firebase/bookings.service';
import { getGymsByIds } from '../services/firebase/gyms.service';
import type { Booking, BookingStatus, Gym } from '../types/firestore.types';
import BookingCard from '../components/BookingCard';
import SegmentedControl from '../components/SegmentedControl';
import type { TabScreenProps } from '../navigation/TabNavigator';

type Props = TabScreenProps<'Bookings'>;

const TABS: BookingStatus[] = ['upcoming', 'completed', 'cancelled'];
const TAB_LABELS = ['Upcoming', 'Completed', 'Cancelled'];

export default function BookingsScreen({ navigation }: Props) {
  const insets = useSafeInsets();
  const [tabIndex, setTabIndex] = useState(0);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [gymsById, setGymsById] = useState<Record<string, Gym>>({});
  const activeStatus = TABS[tabIndex];

  useEffect(() => {
    const uid = authInstance.currentUser?.uid;
    if (!uid) return;
    return subscribeToUserBookings(uid, setBookings);
  }, []);

  useEffect(() => {
    if (!bookings) return;
    const ids = [...new Set(bookings.map(b => b.gymId))];
    getGymsByIds(ids).then(gyms => {
      setGymsById(Object.fromEntries(gyms.map(g => [g.id, g])));
    });
  }, [bookings]);

  const filtered = bookings?.filter(b => b.status === activeStatus) ?? [];

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
        {bookings === null ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <Text style={styles.emptyText}>No {activeStatus} bookings yet.</Text>
        ) : (
          filtered.map(booking => {
            const gym = gymsById[booking.gymId];
            if (!gym) return null; // still waiting on the gym lookup for this one
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
          })
        )}
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
