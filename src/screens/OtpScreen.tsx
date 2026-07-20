// screens/OtpScreen.tsx
import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import PrimaryButton from '../components/PrimaryButton';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Otp'>;
const CODE_LENGTH = 6;

export default function OtpScreen({ navigation, route }: Props) {
  const insets = useSafeInsets();
  const { phone } = route.params;
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(30);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (seconds === 0) return;
    const id = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const timerLabel = `00:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft size={20} color={colors.foreground} strokeWidth={1.8} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to{' '}
          <Text style={{ fontFamily: font.semibold, color: colors.foreground }}>
            +91 {phone || '98765 43210'}
          </Text>
        </Text>

        <View style={styles.otpWrap}>
          <View style={styles.boxRow} pointerEvents="none">
            {Array.from({ length: CODE_LENGTH }).map((_, i) => {
              const active = i === code.length;
              return (
                <View key={i} style={[styles.box, active && styles.boxActive]}>
                  <Text style={styles.boxText}>{code[i] ?? ''}</Text>
                </View>
              );
            })}
          </View>

          {/* Real input, sized to exactly cover the boxes above — tapping
             anywhere in that area is a native tap on this input, so focus
             and the keyboard behave correctly every time, including after
             the keyboard has been dismissed. */}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={t =>
              setCode(t.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH))
            }
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            autoFocus
            style={styles.hiddenInput}
          />
        </View>
        <Pressable disabled={seconds > 0} onPress={() => setSeconds(30)}>
          <Text style={styles.resend}>
            Didn't get it?{' '}
            <Text style={{ color: colors.accent, fontFamily: font.semibold }}>
              {seconds > 0 ? `Resend in ${timerLabel}` : 'Resend'}
            </Text>
          </Text>
        </Pressable>
      </View>

      <View style={[styles.ctaWrap, { paddingBottom: insets.bottom }]}>
        <PrimaryButton
          label="Verify & Continue"
          disabled={code.length !== CODE_LENGTH}
          onPress={() => navigation.replace('MainTabs')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { paddingHorizontal: 20 },
  backButton: {
    height: 36,
    width: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, paddingHorizontal: 28, paddingTop: 24 },
  title: {
    fontSize: 24,
    lineHeight: 29,
    fontFamily: font.bold,
    color: colors.foreground,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  boxRow: { flexDirection: 'row', gap: 10 },
  box: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  boxActive: { borderColor: colors.foreground },
  boxText: { fontSize: 18, fontFamily: font.bold, color: colors.foreground },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  resend: {
    marginTop: 20,
    fontSize: 13,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  ctaWrap: { paddingHorizontal: 28, paddingTop: 16 },
  otpWrap: { marginTop: 32, position: 'relative' },
});
