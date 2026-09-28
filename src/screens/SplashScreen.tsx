// src/screens/SplashScreen.tsx
import { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import {
  subscribeToAuthState,
  checkUserStatus,
  buildRegistrationParams,
} from '../services/firebase/auth.service';
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

    // Wait for both the splash hold time AND Firebase's first auth-state
    // callback (persisted session restore), then route once based on
    // whichever resolves last.
    //
    // A signed-in Firebase user isn't necessarily a fully registered one —
    // someone can verify an OTP or sign in with Google and then close the
    // app before finishing the Registration screen. Routing purely on
    // "is there a session" would silently drop that person into Home with
    // an incomplete profile next time they open the app, so this also
    // checks registrationComplete and sends them back to finish
    // Registration if it isn't set.
    let timedOut = false;
    let authChecked = false;
    let navigated = false;
    let route: 'MainTabs' | 'Onboarding' | 'Registration' = 'Onboarding';
    let registrationParams: ReturnType<typeof buildRegistrationParams> | null =
      null;

    const tryNavigate = () => {
      if (navigated || !timedOut || !authChecked) return;
      navigated = true;
      if (route === 'Registration' && registrationParams) {
        navigation.replace('Registration', registrationParams);
      } else {
        navigation.replace(route as 'MainTabs' | 'Onboarding');
      }
    };

    const timer = setTimeout(() => {
      timedOut = true;
      tryNavigate();
    }, HOLD_DURATION);

    const unsubscribe = subscribeToAuthState(async user => {
      if (!user) {
        route = 'Onboarding';
        authChecked = true;
        tryNavigate();
        return;
      }
      try {
        const { isRegistered } = await checkUserStatus(user.uid);
        route = isRegistered ? 'MainTabs' : 'Registration';
      } catch {
        // Firestore read failed — safer to send them to Registration (worst
        // case, a registered user re-confirms already-saved details) than to
        // guess Home for someone whose status we couldn't verify.
        route = 'Registration';
      }
      if (route === 'Registration')
        registrationParams = buildRegistrationParams(user);
      authChecked = true;
      tryNavigate();
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
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
