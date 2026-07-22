// screens/LoginScreen.tsx
import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import PrimaryButton from '../components/PrimaryButton';
import GoogleIcon from '../components/icons/GoogleIcon';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// ---------------------------------------------------------------------------
// Phone + OTP flow is temporarily disabled — see OtpScreen.tsx (commented out
// entirely) and RootNavigator.tsx (Otp route removed). Re-enable both once
// Firebase Phone Auth integration starts.
// ---------------------------------------------------------------------------

export default function LoginScreen({ navigation }: Props) {
  const insets = useSafeInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const isValid = email.includes('@') && password.length >= 6;

  // No backend yet — proceed straight to the app. Swap this for real
  // Firebase Auth sign-in once Firebase integration starts.
  const proceed = () => navigation.replace('MainTabs');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom },
        ]}
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
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="you@example.com"
            placeholderTextColor={`${colors.mutedForeground}99`}
            style={styles.input}
          />
        </View>

        <Text style={[styles.label, { marginTop: 18 }]}>Password</Text>
        <View
          style={[styles.inputRow, passwordFocused && styles.inputRowFocused]}
        >
          <TextInput
            value={password}
            onChangeText={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            placeholder="At least 6 characters"
            placeholderTextColor={`${colors.mutedForeground}99`}
            style={styles.input}
          />
          <Pressable onPress={() => setShowPassword(v => !v)} hitSlop={8}>
            {showPassword ? (
              <EyeOff size={18} color={colors.mutedForeground} />
            ) : (
              <Eye size={18} color={colors.mutedForeground} />
            )}
          </Pressable>
        </View>

        <PrimaryButton
          label="Log In"
          disabled={!isValid}
          onPress={proceed}
          style={{ marginTop: 24 }}
        />

        <View style={styles.dividerRow}>
          <View style={styles.hairline} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.hairline} />
        </View>

        <PrimaryButton
          label="Continue with Google"
          variant="outline"
          icon={<GoogleIcon size={18} />}
          onPress={proceed}
        />

        <Pressable style={styles.skip} onPress={proceed}>
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 28 },
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
  skip: { paddingVertical: 16, alignItems: 'center' },
  skipText: {
    fontSize: 13.5,
    fontFamily: font.semibold,
    color: colors.mutedForeground,
  },
});
