// screens/OtpScreen.tsx
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import PrimaryButton from '../components/PrimaryButton';
import {
  confirmOtp,
  resendOtp,
  checkUserStatus,
  buildRegistrationParams,
} from '../services/firebase/auth.service';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Otp'>;
const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 30;

function otpErrorMessage(err: any): string {
  switch (err?.code) {
    case 'auth/invalid-verification-code':
      return 'That code is incorrect. Please check and try again.';
    case 'auth/code-expired':
      return 'This code has expired — request a new one.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    default:
      return err?.message ?? 'Verification failed. Please try again.';
  }
}

export default function OtpScreen({ navigation, route }: Props) {
  const insets = useSafeInsets();
  const { phone } = route.params;
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(RESEND_COOLDOWN);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (seconds === 0) return;
    const id = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const timerLabel = `00:${seconds.toString().padStart(2, '0')}`;

  const goToHome = () => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] }),
    );
  };

  const handleVerify = async (submittedCode: string) => {
    if (submittedCode.length !== CODE_LENGTH || verifying) return;
    setError(null);
    setVerifying(true);
    try {
      const user = await confirmOtp(submittedCode);
      const { isRegistered } = await checkUserStatus(user.uid);
      if (isRegistered) {
        goToHome();
      } else {
        navigation.replace('Registration', buildRegistrationParams(user));
      }
    } catch (err: any) {
      if (isMounted.current) {
        setError(otpErrorMessage(err));
        setCode(''); // clear the boxes so a wrong code doesn't linger
      }
    } finally {
      if (isMounted.current) setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || resending) return;
    setError(null);
    setResending(true);
    try {
      await resendOtp(phone);
      if (isMounted.current) setSeconds(RESEND_COOLDOWN);
    } catch (err: any) {
      if (isMounted.current) setError(otpErrorMessage(err));
    } finally {
      if (isMounted.current) setResending(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          disabled={verifying}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} color={colors.foreground} strokeWidth={1.8} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to{' '}
          <Text style={{ fontFamily: font.semibold, color: colors.foreground }}>
            +91 {phone}
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
            onChangeText={t => {
              const digits = t.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH);
              setCode(digits);
              if (error) setError(null);
              if (digits.length === CODE_LENGTH) handleVerify(digits);
            }}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            autoFocus
            editable={!verifying}
            style={styles.hiddenInput}
            accessibilityLabel="Verification code"
          />
        </View>

        {error ? (
          <Text style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        ) : null}

        {verifying ? (
          <View style={styles.verifyingRow}>
            <ActivityIndicator size="small" color={colors.mutedForeground} />
            <Text style={styles.verifyingText}>Verifying…</Text>
          </View>
        ) : null}

        <Pressable disabled={seconds > 0 || resending} onPress={handleResend}>
          <Text style={[styles.resend, seconds > 0 && { opacity: 0.5 }]}>
            {resending
              ? 'Sending…'
              : seconds > 0
              ? `Didn't get it? Resend in ${timerLabel}`
              : "Didn't get it? Resend code"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { paddingHorizontal: 20, paddingBottom: 12 },
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
  content: { paddingHorizontal: 28, paddingTop: 12 },
  title: {
    fontSize: 22,
    lineHeight: 28,
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
  otpWrap: { marginTop: 32 },
  boxRow: { flexDirection: 'row', justifyContent: 'space-between' },
  box: {
    width: 46,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: { borderColor: colors.foreground },
  boxText: {
    fontSize: 20,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  error: {
    marginTop: 20,
    fontSize: 13,
    fontFamily: font.medium,
    color: colors.error,
  },
  verifyingRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifyingText: {
    fontSize: 13,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  resend: {
    marginTop: 28,
    fontSize: 13.5,
    fontFamily: font.medium,
    color: colors.foreground,
    textAlign: 'center',
  },
});
