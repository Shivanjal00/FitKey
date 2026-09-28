// src/screens/RegistrationScreen.tsx
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MapPin, RefreshCw } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { useUserLocation } from '../store/UserLocationContext';
import { forwardGeocode } from '../services/location.service';
import { completeRegistration } from '../services/firebase/auth.service';
import { authInstance } from '../services/firebase';
import PrimaryButton from '../components/PrimaryButton';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Registration'>;

export default function RegistrationScreen({ navigation, route }: Props) {
  const insets = useSafeInsets();
  const { phone: paramPhone, displayName } = route.params;
  const {
    coords,
    address,
    loading: locationLoading,
    permissionDenied,
    refresh,
  } = useUserLocation();

  const [name, setName] = useState(displayName ?? '');
  const [phone, setPhone] = useState(paramPhone ?? '');
  const [locationText, setLocationText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Prefill quietly if GPS+reverse-geocode succeeds — but only once, and
  // only if the user hasn't already typed something themselves.
  useEffect(() => {
    if (address) setLocationText(prev => prev || address);
  }, [address]);

  const autofilled = !!address && locationText === address;

  const isValid = name.trim().length > 0 && locationText.trim().length > 0;

  const handleSubmit = async () => {
    setErrorMsg('');
    setSubmitting(true);
    try {
      // Whatever's in the field right now — autofilled, edited, or fully
      // typed by hand — gets re-geocoded fresh so the saved coordinates
      // always genuinely match this text, not a stale GPS fix.
      const finalAddress = locationText.trim();
      const finalCoords =
        finalAddress === address ? coords : await forwardGeocode(finalAddress);

      await completeRegistration({
        name: name.trim(),
        phone: phone.trim(),
        address: finalAddress,
        coords: finalCoords,
      });
      navigation.replace('MainTabs');
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const showManualHint =
    !locationLoading && !permissionDenied && !address && !locationText;

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
        <Text style={styles.title}>Complete your profile</Text>
        <Text style={styles.subtitle}>
          Just a few details before you start booking.
        </Text>

        <Text style={styles.label}>Full name</Text>
        <View style={styles.inputRow}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={`${colors.mutedForeground}99`}
            style={styles.input}
          />
        </View>

        <Text style={[styles.label, { marginTop: 18 }]}>Phone number</Text>
        <View style={styles.inputRow}>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+91 98765 43210"
            placeholderTextColor={`${colors.mutedForeground}99`}
            style={styles.input}
          />
        </View>

        <Text style={[styles.label, { marginTop: 18 }]}>Location</Text>

        {permissionDenied ? (
          <Pressable style={styles.locationPrompt} onPress={refresh}>
            <MapPin size={16} color={colors.accent} />
            <Text style={styles.locationPromptText}>
              Enable location access
            </Text>
          </Pressable>
        ) : (
          <View
            style={[
              styles.inputRow,
              { flexDirection: 'row', alignItems: 'center' },
            ]}
          >
            {locationLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.mutedForeground}
                style={{ marginRight: 10 }}
              />
            ) : (
              <MapPin
                size={16}
                color={colors.mutedForeground}
                style={{ marginRight: 10 }}
              />
            )}
            <TextInput
              value={locationText}
              onChangeText={t => {
                setLocationText(t);
              }}
              placeholder={
                locationLoading
                  ? 'Detecting your location…'
                  : 'Enter your area or address'
              }
              placeholderTextColor={`${colors.mutedForeground}99`}
              style={[styles.input, { flex: 1 }]}
            />
            <Pressable onPress={refresh} hitSlop={8}>
              <RefreshCw size={16} color={colors.mutedForeground} />
            </Pressable>
          </View>
        )}

        {autofilled && locationText === address && (
          <Text style={styles.locationHint}>
            Detected via GPS — edit if this isn't right.
          </Text>
        )}
        {showManualHint && (
          <Text style={styles.locationHint}>
            Couldn't detect automatically — please type it in.
          </Text>
        )}

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <PrimaryButton
          label={submitting ? 'Saving…' : 'Continue'}
          disabled={!isValid || submitting}
          onPress={handleSubmit}
          style={{ marginTop: 28 }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 28 },
  title: { fontSize: 23, fontFamily: font.bold, color: colors.foreground },
  subtitle: {
    marginTop: 8,
    fontSize: 13.5,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  label: {
    marginTop: 24,
    fontSize: 12.5,
    fontFamily: font.medium,
    color: colors.mutedForeground,
  },
  inputRow: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  input: {
    fontSize: 15,
    fontFamily: font.regular,
    color: colors.foreground,
    padding: 0,
  },
  locationHint: {
    marginTop: 6,
    fontSize: 11,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  locationPrompt: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: `${colors.accent}0D`,
  },
  locationPromptText: {
    fontSize: 14,
    fontFamily: font.semibold,
    color: colors.accent,
  },
  errorText: {
    marginTop: 16,
    fontSize: 12.5,
    fontFamily: font.medium,
    color: colors.error,
    textAlign: 'center',
  },
});
