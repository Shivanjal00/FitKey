// src/screens/BookingStatusScreen.tsx
import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckCircle2 } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { GYMS } from '../data/gyms';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingStatus'>;

export default function BookingStatusScreen({ route, navigation }: Props) {
  const insets = useSafeInsets();
  const { gymId } = route.params;
  const gym = GYMS.find(g => g.id === gymId) ?? GYMS[0];
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const ringScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25],
  });
  const ringOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0],
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}
    >
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Animated.View
            style={[
              styles.pulseRing,
              { transform: [{ scale: ringScale }], opacity: ringOpacity },
            ]}
          />
          <View style={styles.iconCircle}>
            <CheckCircle2
              size={32}
              color={colors.primaryForeground}
              strokeWidth={2}
            />
          </View>
        </View>

        <Text style={styles.title}>Booking Confirmed</Text>
        <Text style={styles.subtitle}>
          You're all set at {gym.name}. We'll see you at your booked slot.
        </Text>

        <View style={styles.gymCard}>
          <Image source={{ uri: gym.image }} style={styles.gymImage} />
          <View>
            <Text style={styles.gymName}>{gym.name}</Text>
            <Text style={styles.gymMeta}>Fri, 18 Jul · 6:00 AM</Text>
          </View>
        </View>
      </View>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}
      >
        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate('MainTabs', { screen: 'Bookings' })
          }
        >
          <Text style={styles.primaryButtonText}>View Booking</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
        >
          <Text style={styles.secondaryButtonText}>Return Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 32,
  },
  iconWrap: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 24,
    fontSize: 20,
    fontFamily: font.bold,
    color: colors.foreground,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13.5,
    lineHeight: 20,
    fontFamily: font.regular,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  gymCard: {
    marginTop: 28,
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 16,
  },
  gymImage: { width: 56, height: 56, borderRadius: 16 },
  gymName: {
    fontSize: 14,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  gymMeta: {
    marginTop: 2,
    fontSize: 12.5,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  footer: { paddingHorizontal: 28, gap: 12, paddingTop: 16 },
  primaryButton: {
    backgroundColor: colors.foreground,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontFamily: font.semibold,
    color: colors.primaryForeground,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14.5,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
});
