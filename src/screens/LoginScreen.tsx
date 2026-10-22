// src/screens/LoginScreen.tsx
import { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import PrimaryButton from '../components/PrimaryButton';
import GoogleIcon from '../components/icons/GoogleIcon';
import type { RootStackParamList } from '../navigation/RootNavigator';
import {
  googleAuth,
  buildRegistrationParams,
} from '../services/firebase/auth.service';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const insets = useSafeInsets();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogle = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const { user, isNewUser } = await googleAuth();
      if (isNewUser) {
        navigation.replace('Registration', buildRegistrationParams(user));
      } else {
        navigation.replace('MainTabs');
      }
    } catch {
      setErrorMsg('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <Text style={styles.title}>Welcome to GymBym</Text>
      <Text style={styles.subtitle}>Sign in with Google to continue.</Text>

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <PrimaryButton
        label={loading ? 'Please wait…' : 'Continue with Google'}
        icon={<GoogleIcon size={18} />}
        onPress={handleGoogle}
        disabled={loading}
        style={{ marginTop: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 28, justifyContent: 'center' },
  logo: { alignItems: 'center', marginBottom: 8 },
  logoImage: { width: 64, height: 64 },
  title: {
    fontSize: 25,
    lineHeight: 30,
    fontFamily: font.bold,
    color: colors.foreground,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: font.regular,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 20,
    fontSize: 12.5,
    fontFamily: font.medium,
    color: colors.error,
    textAlign: 'center',
  },
});
