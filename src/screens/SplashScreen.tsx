// src/screens/SplashScreen.tsx
import { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const HOLD_DURATION = 1400;

export default function SplashScreen({ navigation }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, HOLD_DURATION);

    return () => clearTimeout(timer);
  }, [navigation, opacity, scale]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text style={[styles.tagline, { opacity }]}>
        Workout Anywhere.
      </Animated.Text>

      <Animated.View style={[styles.dotsRow, { opacity }]}>
        <View style={[styles.dot, { opacity: 0.2 }]} />
        <View style={[styles.dot, { opacity: 0.5 }]} />
        <View style={[styles.dot, { opacity: 1 }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 80, height: 80 },
  tagline: {
    marginTop: 20,
    fontSize: 13,
    fontFamily: font.medium,
    color: colors.mutedForeground,
    letterSpacing: 0.3,
  },
  dotsRow: { flexDirection: 'row', gap: 6, marginTop: 40 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.foreground,
  },
});
