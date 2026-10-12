// src/screens/LibraryDetailsScreen.tsx
import { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker } from 'react-native-maps';
import {
  ArrowLeft,
  Star,
  Users,
  Clock,
  Wifi,
  Sofa,
  GraduationCap,
  Building2,
  MapPin,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { useAsync } from '../lib/useAsync';
import { getLibraryById } from '../services/firebase/libraries.service';
import { useUserLocation } from '../store/UserLocationContext';
import {
  toCoordinates,
  calculateDistanceKm,
  formatDistance,
} from '../services/location.service';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'LibraryDetails'>;

const TAG_ICONS: Record<string, any> = {
  'Silent Study': Sofa,
  '24x7': Clock,
  Coworking: Building2,
  'Exam Prep': GraduationCap,
  'Wi-Fi': Wifi,
};

export default function LibraryDetailsScreen({ route, navigation }: Props) {
  const insets = useSafeInsets();
  const { libraryId } = route.params;
  const { data: library, loading } = useAsync(
    () => getLibraryById(libraryId),
    [libraryId],
  );
  const { coords: userCoords } = useUserLocation();
  const [planIndex, setPlanIndex] = useState(0);
  const [reserved, setReserved] = useState(false);

  if (loading || !library) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  // Fallbacks so a listing missing one of these fields can't crash the screen.
  const tags = library.tags ?? [];
  const plans = library.plans ?? [];
  const selectedPlan = plans[planIndex] ?? plans[0];

  // Plain numbers, safe for the native map (a raw GeoPoint is not).
  const mapCoords = toCoordinates(library.location);
  const distanceLabel =
    userCoords && mapCoords
      ? formatDistance(calculateDistanceKm(userCoords, mapCoords))
      : library.distance || null;
  const locationLine = [library.area, distanceLabel]
    .filter(Boolean)
    .join(' · ');

  const openNavigation = () => {
    if (!mapCoords) return;
    const { latitude, longitude } = mapCoords;
    Linking.openURL(`google.navigation:q=${latitude},${longitude}`).catch(() =>
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      ),
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: library.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { top: insets.top }]}
          >
            <ArrowLeft size={18} color={colors.foreground} strokeWidth={2} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{library.name}</Text>
          <View style={styles.ratingRow}>
            <Star size={14} color={colors.warn} fill={colors.warn} />
            <Text style={styles.ratingText}>{library.rating}</Text>
            <Text style={styles.dotSep}>·</Text>
            <Text style={styles.area}>{locationLine}</Text>
          </View>

          <View style={styles.infoRow}>
            {typeof library.seats === 'number' && (
              <View style={styles.infoItem}>
                <Users size={16} color={colors.mutedForeground} />
                <Text style={styles.infoText}>{library.seats} seats</Text>
              </View>
            )}
            <View style={styles.infoItem}>
              <Clock size={16} color={colors.mutedForeground} />
              <Text style={styles.infoText}>{library.hours}</Text>
            </View>
            <Text
              style={[
                styles.openStatus,
                { color: library.open ? colors.success : colors.error },
              ]}
            >
              {library.open ? 'Open now' : 'Closed now'}
            </Text>
          </View>

          {mapCoords && (
            <View style={styles.mapPreview}>
              <View style={{ flex: 1 }} pointerEvents="none">
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: mapCoords.latitude,
                    longitude: mapCoords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker coordinate={mapCoords} />
                </MapView>
              </View>
              <Pressable style={styles.mapPill} onPress={openNavigation}>
                <MapPin size={13} color={colors.foreground} />
                <Text style={styles.mapPillText}>Navigate</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{library.about}</Text>

          {tags.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.tagsGrid}>
                {tags.map(tag => {
                  const Icon = TAG_ICONS[tag] ?? Sofa;
                  return (
                    <View key={tag} style={styles.tagItem}>
                      <View style={styles.tagIconWrap}>
                        <Icon
                          size={20}
                          color={colors.foreground}
                          strokeWidth={1.8}
                        />
                      </View>
                      <Text style={styles.tagLabel}>{tag}</Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {plans.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Passes</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              >
                {plans.map((plan, i) => {
                  const selected = i === planIndex;
                  return (
                    <Pressable
                      key={plan.name}
                      onPress={() => setPlanIndex(i)}
                      style={[
                        styles.planCard,
                        selected && styles.planCardSelected,
                      ]}
                    >
                      <Text style={styles.planName}>{plan.name}</Text>
                      {selected && (
                        <Text style={styles.planSelectedLabel}>Selected</Text>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>

      {selectedPlan && (
        <View
          style={[
            styles.stickyBar,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <Pressable
            style={[styles.reserveButton, reserved && styles.reserveButtonDone]}
            onPress={() => setReserved(true)}
          >
            <Text style={styles.reserveButtonText}>
              {reserved
                ? 'Seat Reserved ✓'
                : `Reserve Seat · ${selectedPlan.name}`}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrap: { height: 260, width: '100%' },
  image: { width: '100%', height: '100%' },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  name: { fontSize: 21, fontFamily: font.bold, color: colors.foreground },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  dotSep: { fontSize: 13, color: colors.mutedForeground },
  area: {
    fontSize: 13,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, fontFamily: font.medium, color: colors.foreground },
  openStatus: { fontSize: 12, fontFamily: font.semibold, marginLeft: 'auto' },
  mapPreview: {
    height: 112,
    borderRadius: 16,
    marginTop: 12,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  mapPill: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  mapPillText: {
    fontSize: 12,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 20,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: font.bold,
    color: colors.foreground,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 13.5,
    lineHeight: 21,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginTop: 6 },
  tagItem: { alignItems: 'center', gap: 6, width: 68 },
  tagIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagLabel: {
    fontSize: 11,
    fontFamily: font.regular,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  planCard: {
    width: 128,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    marginBottom: 24,
  },
  planCardSelected: {
    borderColor: colors.accent,
    backgroundColor: `${colors.accent}0D`,
  },
  planName: {
    fontSize: 13,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  planSelectedLabel: {
    fontSize: 10.5,
    fontFamily: font.semibold,
    color: colors.accent,
    marginTop: 4,
  },
  stickyBar: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  reserveButton: {
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  reserveButtonDone: { backgroundColor: colors.success },
  reserveButtonText: {
    fontSize: 15,
    fontFamily: font.semibold,
    color: colors.primaryForeground,
  },
});
