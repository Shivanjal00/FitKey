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
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import PrimaryButton from '../components/PrimaryButton';
import GoogleIcon from '../components/icons/GoogleIcon';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const insets = useSafeInsets();
  const [phone, setPhone] = useState('');
  const [focused, setFocused] = useState(false);
  const isValid = phone.length === 10;

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
          Enter your phone number to sign in or create an account.
        </Text>
        <Text style={styles.label}>Phone number</Text>
        <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
          <Text style={styles.prefix}>+91</Text>
          <View style={styles.divider} />
          <TextInput
            value={phone}
            onChangeText={t => setPhone(t.replace(/[^0-9]/g, '').slice(0, 10))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType="number-pad"
            placeholder="98765 43210"
            placeholderTextColor={`${colors.mutedForeground}99`}
            style={styles.input}
            maxLength={10}
          />
        </View>
        <PrimaryButton
          label="Send OTP"
          disabled={!isValid}
          onPress={() => navigation.navigate('Otp', { phone })}
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
          onPress={() => navigation.navigate('Otp', { phone: '' })}
        />
        <Pressable
          style={styles.skip}
          onPress={() => navigation.replace('MainTabs')}
        >
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
  prefix: { fontSize: 15, fontFamily: font.semibold, color: colors.foreground },
  divider: { width: 1, height: 20, backgroundColor: colors.border },
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
