// screens/LoginScreen.tsx
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import PrimaryButton from '../components/PrimaryButton';
import GoogleIcon from '../components/icons/GoogleIcon';
import { emailAuth, googleAuth } from '../services/firebase/auth.service';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// ---------------------------------------------------------------------------
// Phone + OTP flow is temporarily disabled — see OtpScreen.tsx (commented out
// entirely) and RootNavigator.tsx (Otp route removed). Re-enable both once
// Firebase Phone Auth integration starts.
// ---------------------------------------------------------------------------

// Firebase auth error codes -> friendly copy. Falls back to a generic
// message for anything not covered here.
function authErrorMessage(err: any): string {
  switch (err?.code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support for help.';
    default:
      return err?.message ?? 'Something went wrong. Please try again.';
  }
}

export default function LoginScreen({ navigation }: Props) {
  const insets = useSafeInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [submitting, setSubmitting] = useState<'email' | 'google' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const passwordInputRef = useRef<TextInput>(null);

  // Guards against setState-after-unmount if the user navigates away (or
  // the screen is torn down) while an auth request is still in flight.
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const trimmedEmail = email.trim();
  const isValid = trimmedEmail.includes('@') && password.length >= 6;

  const goToApp = () => navigation.replace('MainTabs');

  const handleEmailLogin = async () => {
    if (!isValid || submitting) return;
    setError(null);
    setSubmitting('email');
    try {
      await emailAuth(trimmedEmail, password);
      // No isMounted check needed before navigating — success means we
      // want to leave this screen regardless.
      goToApp();
    } catch (err: any) {
      if (isMounted.current) setError(authErrorMessage(err));
    } finally {
      if (isMounted.current) setSubmitting(null);
    }
  };

  const handleGoogleLogin = async () => {
    if (submitting) return;
    setError(null);
    setSubmitting('google');
    try {
      await googleAuth();
      goToApp();
    } catch (err: any) {
      // User-initiated cancellation isn't an error worth surfacing.
      if (isMounted.current && err?.code !== 'SIGN_IN_CANCELLED') {
        setError(authErrorMessage(err));
      }
    } finally {
      if (isMounted.current) setSubmitting(null);
    }
  };

  const isSubmitting = submitting !== null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.logo}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Welcome to FitKey</Text>
        <Text style={styles.subtitle}>
          Sign in with your email to continue.
        </Text>

        <Text style={styles.label}>Email address</Text>
        <View style={[styles.inputRow, emailFocused && styles.inputRowFocused]}>
          <TextInput
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (error) setError(null);
            }}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            importantForAutofill="yes"
            placeholder="you@example.com"
            placeholderTextColor={`${colors.mutedForeground}99`}
            style={styles.input}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            editable={!isSubmitting}
            accessibilityLabel="Email address"
          />
        </View>

        <Text style={[styles.label, { marginTop: 18 }]}>Password</Text>
        <View
          style={[styles.inputRow, passwordFocused && styles.inputRowFocused]}
        >
          <TextInput
            ref={passwordInputRef}
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (error) setError(null);
            }}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password"
            textContentType="password"
            importantForAutofill="yes"
            placeholder="At least 6 characters"
            placeholderTextColor={`${colors.mutedForeground}99`}
            style={styles.input}
            returnKeyType="go"
            onSubmitEditing={handleEmailLogin}
            editable={!isSubmitting}
            accessibilityLabel="Password"
          />
          <Pressable
            onPress={() => setShowPassword(v => !v)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              showPassword ? 'Hide password' : 'Show password'
            }
          >
            {showPassword ? (
              <EyeOff size={18} color={colors.mutedForeground} />
            ) : (
              <Eye size={18} color={colors.mutedForeground} />
            )}
          </Pressable>
        </View>

        {error ? (
          <Text style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        ) : null}

        <PrimaryButton
          label="Log In"
          disabled={!isValid || isSubmitting}
          onPress={handleEmailLogin}
          icon={
            submitting === 'email' ? (
              <ActivityIndicator
                size="small"
                color={colors.primaryForeground}
              />
            ) : undefined
          }
          style={{ marginTop: error ? 12 : 24 }}
        />

        <View style={styles.dividerRow}>
          <View style={styles.hairline} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.hairline} />
        </View>

        <PrimaryButton
          label="Continue with Google"
          variant="outline"
          disabled={isSubmitting}
          icon={
            submitting === 'google' ? (
              <ActivityIndicator size="small" color={colors.foreground} />
            ) : (
              <GoogleIcon size={18} />
            )
          }
          onPress={handleGoogleLogin}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 28 },
  logo: { marginBottom: 8 },
  logoImage: { width: 56, height: 56 },
  title: {
    fontSize: 25,
    lineHeight: 30,
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
  label: {
    marginTop: 32,
    fontSize: 12.5,
    fontFamily: font.medium,
    color: colors.mutedForeground,
  },
  inputRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: colors.surface,
  },
  inputRowFocused: { borderColor: colors.foreground },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: font.regular,
    color: colors.foreground,
    padding: 0,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  hairline: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: {
    fontSize: 12,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  error: {
    marginTop: 16,
    fontSize: 13,
    fontFamily: font.medium,
    color: colors.error,
  },
});
