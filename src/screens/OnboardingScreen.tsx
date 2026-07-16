// screens/OnboardingScreen.tsx
import { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronLeft, ArrowRight } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const SLIDES = [
  {
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    title: 'Discover nearby gyms',
    body: 'Explore hundreds of premium studios around you — from strength to yoga.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1200&q=80',
    title: 'Book instantly',
    body: 'Pick a plan, choose your slot, and confirm in seconds.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    title: 'Workout anywhere',
    body: 'One pass, hundreds of gyms across the city.',
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const insets = useSafeInsets();
  const [step, setStep] = useState(0);
  const scale = useRef(new Animated.Value(1)).current;
  const slide = SLIDES[step];
  const isFirst = step === 0;

  const pressIn = () =>
    Animated.timing(scale, {
      toValue: 0.99,
      duration: 80,
      useNativeDriver: true,
    }).start();
  const pressOut = () =>
    Animated.timing(scale, {
      toValue: 1,
      duration: 80,
      useNativeDriver: true,
    }).start();

  const onContinue = () => {
    if (step < SLIDES.length - 1) setStep(step + 1);
    else navigation.replace('Login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <Pressable
          onPress={() => setStep(Math.max(0, step - 1))}
          disabled={isFirst}
          style={[styles.backButton, { opacity: isFirst ? 0 : 1 }]}
        >
          <ChevronLeft size={20} color={colors.foreground} strokeWidth={1.8} />
        </Pressable>
        <Pressable onPress={() => navigation.replace('Login')}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.imageWrap}>
        <Image
          source={{ uri: slide.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)']}
          style={styles.gradient}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: i === step ? 24 : 6,
                  backgroundColor:
                    i === step ? colors.foreground : colors.borderStrong,
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </View>

      <View style={[styles.ctaWrap, { paddingBottom: insets.bottom }]}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Pressable
            onPress={onContinue}
            onPressIn={pressIn}
            onPressOut={pressOut}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>Continue</Text>
            <ArrowRight
              size={16}
              color={colors.primaryForeground}
              strokeWidth={2.2}
            />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skip: {
    fontSize: 13,
    fontFamily: font.medium,
    color: colors.mutedForeground,
  },
  imageWrap: {
    marginHorizontal: 20,
    marginTop: 24,
    aspectRatio: 3 / 4,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '33%',
  },
  content: { flex: 1, paddingHorizontal: 24, marginTop: 32 },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 4, borderRadius: 999 },
  title: {
    marginTop: 24,
    fontSize: 32,
    lineHeight: 35,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  body: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 24,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  ctaWrap: { paddingHorizontal: 24, paddingTop: 24 },
  cta: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.foreground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: {
    fontSize: 15,
    fontFamily: font.semibold,
    color: colors.primaryForeground,
  },
});
