// src/screens/EditProfileScreen.tsx
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
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import PrimaryButton from '../components/PrimaryButton';
import { authInstance } from '../services/firebase';
import { updateUserProfile } from '../services/firebase/auth.service';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=300&q=80';

function isValidUrl(value: string) {
  if (!value) return true; // empty is allowed — it clears the photo
  return /^https?:\/\/.+/i.test(value);
}

function friendlySaveError(err: any): string {
  if (err?.code === 'auth/network-request-failed') {
    return 'Network error. Check your connection and try again.';
  }
  return err?.message ?? 'Could not save your changes. Please try again.';
}

export default function EditProfileScreen({ navigation, route }: Props) {
  const insets = useSafeInsets();
  const { displayName: initialName, photoURL: initialPhoto } = route.params;

  const [displayName, setDisplayName] = useState(initialName);
  const [photoURL, setPhotoURL] = useState(initialPhoto ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guards against setState-after-unmount if the user backs out while a
  // save request is still in flight.
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const trimmedName = displayName.trim();
  const trimmedPhoto = photoURL.trim();
  const photoIsValid = isValidUrl(trimmedPhoto);
  const isValid = trimmedName.length > 0 && photoIsValid;
  const hasChanges =
    trimmedName !== initialName || trimmedPhoto !== (initialPhoto ?? '');
  const canSave = isValid && hasChanges && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    const user = authInstance.currentUser;
    if (!user) {
      setError('Your session expired — please log in again.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await updateUserProfile(user, {
        displayName: trimmedName,
        photoURL: trimmedPhoto ? trimmedPhoto : null,
      });
      if (isMounted.current) navigation.goBack();
    } catch (err: any) {
      if (isMounted.current) setError(friendlySaveError(err));
    } finally {
      if (isMounted.current) setSaving(false);
    }
  };

  const previewUri =
    photoIsValid && trimmedPhoto ? trimmedPhoto : FALLBACK_AVATAR;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
    >
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          disabled={saving}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} color={colors.foreground} strokeWidth={1.8} />
        </Pressable>
        <Text style={styles.topBarTitle}>Edit Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarWrap}>
          <Image source={{ uri: previewUri }} style={styles.avatar} />
        </View>

        <Text style={styles.label}>Display name</Text>
        <View style={styles.inputRow}>
          <TextInput
            value={displayName}
            onChangeText={text => {
              setDisplayName(text);
              if (error) setError(null);
            }}
            placeholder="Your name"
            placeholderTextColor={`${colors.mutedForeground}99`}
            style={styles.input}
            maxLength={60}
            autoCapitalize="words"
            returnKeyType="next"
            editable={!saving}
            accessibilityLabel="Display name"
          />
        </View>

        <Text style={[styles.label, { marginTop: 18 }]}>Photo URL</Text>
        <View style={styles.inputRow}>
          <TextInput
            value={photoURL}
            onChangeText={text => {
              setPhotoURL(text);
              if (error) setError(null);
            }}
            placeholder="https://…  (optional)"
            placeholderTextColor={`${colors.mutedForeground}99`}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="done"
            onSubmitEditing={handleSave}
            editable={!saving}
            accessibilityLabel="Photo URL"
          />
        </View>
        {!photoIsValid ? (
          <Text style={styles.hintError}>
            Enter a valid http(s) link, or leave it blank.
          </Text>
        ) : (
          <Text style={styles.hint}>
            Paste a link to an image. Leave blank to use the default avatar.
          </Text>
        )}

        {error ? (
          <Text style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        ) : null}

        <PrimaryButton
          label="Save changes"
          disabled={!canSave}
          onPress={handleSave}
          icon={
            saving ? (
              <ActivityIndicator
                size="small"
                color={colors.primaryForeground}
              />
            ) : undefined
          }
          style={{ marginTop: error ? 12 : 28 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
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
  topBarTitle: {
    fontSize: 15,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  content: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 8 },
  avatarWrap: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
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
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: font.regular,
    color: colors.foreground,
    padding: 0,
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  hintError: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: font.regular,
    color: colors.error,
  },
  error: {
    marginTop: 16,
    fontSize: 13,
    fontFamily: font.medium,
    color: colors.error,
  },
});
