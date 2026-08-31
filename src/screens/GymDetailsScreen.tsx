// src/screens/GymDetailsScreen.tsx
import { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Clock,
  Navigation as NavigationIcon,
  Wind,
  ShowerHead,
  Lock,
  Dumbbell,
  Car,
  User,
  Star,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { useAsync } from '../lib/useAsync';
import { getGymById } from '../services/firebase/gyms.service';
import { useFavorites } from '../store/FavoritesContext';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'GymDetails'>;
const { width } = Dimensions.get('window');

const FACILITY_ICONS: Record<string, any> = {
  AC: Wind,
  Shower: ShowerHead,
  Locker: Lock,
  Trainer: Dumbbell,
  Parking: Car,
  'Women Only': User,
};

export default function GymDetailsScreen({ route, navigation }: Props) {
  const insets = useSafeInsets();
  const { gymId } = route.params;
  const { data: gym, loading } = useAsync(() => getGymById(gymId), [gymId]);
  const { isFavorite, toggleFavorite } = useFavorites();

  const [galleryIndex, setGalleryIndex] = useState(0);
  const [planIndex, setPlanIndex] = useState(0);

  if (loading || !gym) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  const favorite = isFavorite(gym.id);

  const onScrollGallery = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setGalleryIndex(index);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.galleryWrap}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScrollGallery}
          >
            {gym.gallery.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                style={{ width, height: 288 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          <View style={[styles.galleryTopBar, { top: insets.top }]}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.roundButton}
            >
              <ArrowLeft size={18} color={colors.foreground} strokeWidth={2} />
            </Pressable>
            <View style={styles.galleryTopRight}>
              <Pressable
                onPress={() => toggleFavorite(gym.id)}
                style={styles.roundButton}
              >
                <Heart
                  size={18}
                  color={favorite ? colors.error : colors.foreground}
                  fill={favorite ? colors.error : 'none'}
                />
              </Pressable>
              <Pressable style={styles.roundButton}>
                <Share2 size={18} color={colors.foreground} strokeWidth={2} />
              </Pressable>
            </View>
          </View>

          <View style={styles.dotsRow}>
            {gym.gallery.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.galleryDot,
                  { opacity: i === galleryIndex ? 1 : 0.4 },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{gym.category}</Text>
          </View>
          <Text style={styles.name}>{gym.name}</Text>
          <View style={styles.ratingRow}>
            <Star size={14} color={colors.warn} fill={colors.warn} />
            <Text style={styles.ratingText}>{gym.rating}</Text>
            <Text style={styles.reviewsText}>({gym.reviews} reviews)</Text>
          </View>

          <View style={styles.rowIconText}>
            <MapPin size={16} color={colors.mutedForeground} />
            <Text style={styles.mutedText}>
              {gym.area} · {gym.distance}
            </Text>
          </View>
          <View style={styles.mapPreview}>
            <View style={styles.mapPill}>
              <NavigationIcon size={13} color={colors.foreground} />
              <Text style={styles.mapPillText}>Navigate</Text>
            </View>
          </View>

          <View style={[styles.rowIconText, { marginTop: 16 }]}>
            <Clock size={16} color={colors.mutedForeground} />
            <Text style={styles.hoursText}>{gym.hours}</Text>
            <Text
              style={[
                styles.openStatus,
                {
                  color: gym.open ? colors.success : colors.error,
                  marginLeft: 'auto',
                },
              ]}
            >
              {gym.open ? 'Open now' : 'Closed now'}
            </Text>
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{gym.about}</Text>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Facilities</Text>
          <View style={styles.facilitiesGrid}>
            {gym.tags.map(tag => {
              const Icon = FACILITY_ICONS[tag] ?? Dumbbell;
              return (
                <View key={tag} style={styles.facilityItem}>
                  <View style={styles.facilityIconWrap}>
                    <Icon
                      size={20}
                      color={colors.foreground}
                      strokeWidth={1.8}
                    />
                  </View>
                  <Text style={styles.facilityLabel}>{tag}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Membership plans</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {gym.plans.map((plan, i) => {
              const selected = i === planIndex;
              return (
                <Pressable
                  key={plan.name}
                  onPress={() => setPlanIndex(i)}
                  style={[styles.planCard, selected && styles.planCardSelected]}
                >
                  <Text style={styles.planName}>{plan.name}</Text>
                  {selected && (
                    <Text style={styles.planSelectedLabel}>Selected</Text>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={[styles.rowIconText, { marginTop: 24 }]}>
            <Dumbbell size={18} color={colors.mutedForeground} />
            <Text style={[styles.mutedText, { flex: 1 }]}>{gym.trainer}</Text>
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Policies</Text>
          <Text style={[styles.aboutText, { marginBottom: 24 }]}>
            Carry a valid ID for entry. Passes are non-transferable and valid
            only for the selected date and slot. Cancellations are free up to 2
            hours before your slot.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.stickyBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.stickyPlanLabel}>Selected plan</Text>
          <Text style={styles.stickyPlanName}>{gym.plans[planIndex].name}</Text>
        </View>
        <Pressable
          style={styles.bookButton}
          onPress={() =>
            navigation.navigate('SelectSlot', { gymId: gym.id, planIndex })
          }
        >
          <Text style={styles.bookButtonText}>Book Pass</Text>
        </Pressable>
      </View>
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
  galleryWrap: { height: 288, width: '100%' },
  galleryTopBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  galleryTopRight: { flexDirection: 'row', gap: 8 },
  roundButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  galleryDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: `${colors.accent}1A`,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 11.5,
    fontFamily: font.semibold,
    color: colors.accent,
  },
  name: {
    marginTop: 8,
    fontSize: 21,
    fontFamily: font.bold,
    color: colors.foreground,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  reviewsText: {
    fontSize: 13,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  rowIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  mutedText: {
    fontSize: 13.5,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  hoursText: {
    fontSize: 13.5,
    fontFamily: font.medium,
    color: colors.foreground,
  },
  openStatus: { fontSize: 12, fontFamily: font.semibold },
  mapPreview: {
    height: 112,
    borderRadius: 16,
    marginTop: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mapPill: {
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
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 6,
  },
  facilityItem: { width: '21%', alignItems: 'center', gap: 6 },
  facilityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facilityLabel: {
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
  },
  planCardSelected: {
    borderColor: colors.accent,
    backgroundColor: `${colors.accent}0D`,
  },
  planName: {
    fontSize: 12.5,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  stickyPlanLabel: {
    fontSize: 11,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  stickyPlanName: {
    fontSize: 15,
    fontFamily: font.bold,
    color: colors.foreground,
    marginTop: 1,
  },
  bookButton: {
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  bookButtonText: {
    fontSize: 15,
    fontFamily: font.semibold,
    color: colors.primaryForeground,
  },
});
