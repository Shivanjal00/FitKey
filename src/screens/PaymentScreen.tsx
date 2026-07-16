// src/screens/PaymentScreen.tsx
import { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';
import { ArrowLeft, Copy, Clock, ImageUp } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { GYMS } from '../data/gyms';
import QrPattern from '../components/QrPattern';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

export default function PaymentScreen({ route, navigation }: Props) {
  const insets = useSafeInsets();
  const { gymId, total } = route.params;
  const gym = GYMS.find(g => g.id === gymId) ?? GYMS[0];
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
  const upiId = `fitvyora.${gym.id}@upi`;

  const pickScreenshot = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });
    if (result.assets && result.assets[0]?.uri)
      setScreenshotUri(result.assets[0].uri);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={18} color={colors.foreground} strokeWidth={2} />
        </Pressable>
        <Text style={styles.title}>Payment</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.qrCard}>
          <Text style={styles.amountLabel}>Amount payable</Text>
          <Text style={styles.amount}>₹{total}</Text>
          <View style={styles.qrFrame}>
            <QrPattern size={140} />
          </View>
          <Text style={styles.scanHint}>Scan with any UPI app</Text>

          <View style={styles.upiRow}>
            <Text style={styles.upiId}>{upiId}</Text>
            <Pressable style={styles.copyButton}>
              <Copy size={13} color={colors.accent} />
              <Text style={styles.copyText}>Copy</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Payment instructions</Text>
          {[
            'Scan the QR code or copy the UPI ID above',
            'Pay the exact amount shown',
            'Upload your payment screenshot below',
            'Your gym will verify and confirm the booking',
          ].map((step, i) => (
            <Text key={i} style={styles.instructionItem}>
              {i + 1}. {step}
            </Text>
          ))}
        </View>

        <Text style={styles.uploadLabel}>Upload payment screenshot</Text>
        <Pressable style={styles.uploadBox} onPress={pickScreenshot}>
          {screenshotUri ? (
            <Image
              source={{ uri: screenshotUri }}
              style={styles.uploadPreview}
              resizeMode="cover"
            />
          ) : (
            <>
              <ImageUp size={24} color={colors.mutedForeground} />
              <Text style={styles.uploadText}>Tap to upload screenshot</Text>
              <Text style={styles.uploadHint}>PNG or JPG, up to 5MB</Text>
            </>
          )}
        </Pressable>

        <View style={styles.pendingPill}>
          <Clock size={15} color={colors.warn} />
          <Text style={styles.pendingText}>
            {screenshotUri
              ? 'Screenshot attached'
              : 'Awaiting payment screenshot'}
          </Text>
        </View>
      </ScrollView>

      <View
        style={[styles.ctaWrap, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <Pressable
          style={[styles.cta, !screenshotUri && styles.ctaDisabled]}
          disabled={!screenshotUri}
          onPress={() => navigation.navigate('BookingStatus', { gymId })}
        >
          <Text style={styles.ctaText}>I Have Paid</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 17, fontFamily: font.bold, color: colors.foreground },
  content: { flex: 1, paddingHorizontal: 20 },
  qrCard: {
    marginTop: 12,
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 13,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  amount: {
    marginTop: 2,
    fontSize: 26,
    fontFamily: font.bold,
    color: colors.foreground,
  },
  qrFrame: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
  },
  scanHint: {
    marginTop: 12,
    fontSize: 12.5,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  upiRow: {
    marginTop: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  upiId: { fontSize: 13.5, fontFamily: font.medium, color: colors.foreground },
  copyButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  copyText: { fontSize: 12.5, fontFamily: font.semibold, color: colors.accent },
  instructionsCard: {
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 13.5,
    fontFamily: font.semibold,
    color: colors.foreground,
    marginBottom: 8,
  },
  instructionItem: {
    fontSize: 12.5,
    lineHeight: 20,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  uploadLabel: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 13.5,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 22,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  uploadPreview: { width: '100%', height: 160, borderRadius: 16 },
  uploadText: {
    fontSize: 13,
    fontFamily: font.medium,
    color: colors.foreground,
  },
  uploadHint: {
    fontSize: 11.5,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: `${colors.warn}1A`,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pendingText: { fontSize: 12.5, fontFamily: font.medium, color: colors.warn },
  ctaWrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  cta: {
    backgroundColor: colors.foreground,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaDisabled: { backgroundColor: colors.borderStrong },
  ctaText: {
    fontSize: 15,
    fontFamily: font.semibold,
    color: colors.primaryForeground,
  },
});
