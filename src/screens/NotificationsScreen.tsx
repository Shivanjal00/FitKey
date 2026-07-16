// src/screens/NotificationsScreen.tsx
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';
import {
  ArrowLeft,
  CheckCircle2,
  Tag,
  XCircle,
  CalendarClock,
  Sparkles,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { NOTIFICATIONS, NotificationItem } from '../data/notifications';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const ICONS: Record<NotificationItem['icon'], any> = {
  'check-circle': CheckCircle2,
  tag: Tag,
  'x-circle': XCircle,
  'calendar-clock': CalendarClock,
  sparkles: Sparkles,
};

const ICON_STYLE: Record<
  NotificationItem['icon'],
  { bg: string; color: string }
> = {
  'check-circle': { bg: `${colors.success}1A`, color: colors.success },
  tag: { bg: `${colors.accent}1A`, color: colors.accent },
  'x-circle': { bg: `${colors.error}1A`, color: colors.error },
  'calendar-clock': { bg: `${colors.warn}1A`, color: colors.warn },
  sparkles: { bg: `${colors.accent}1A`, color: colors.accent },
};

export default function NotificationsScreen({ navigation }: Props) {
  const insets = useSafeInsets();
  const today = NOTIFICATIONS.filter(n => n.group === 'Today');
  const earlier = NOTIFICATIONS.filter(n => n.group === 'Earlier');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={18} color={colors.foreground} strokeWidth={2} />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Text style={styles.groupLabel}>Today</Text>
        {today.map((n, i) => (
          <NotificationRow
            key={n.id}
            item={n}
            showDivider={i < today.length - 1}
          />
        ))}

        <Text style={[styles.groupLabel, { marginTop: 12 }]}>Earlier</Text>
        {earlier.map((n, i) => (
          <NotificationRow
            key={n.id}
            item={n}
            showDivider={i < earlier.length - 1}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function NotificationRow({
  item,
  showDivider,
}: {
  item: NotificationItem;
  showDivider: boolean;
}) {
  const Icon = ICONS[item.icon];
  const style = ICON_STYLE[item.icon];
  return (
    <View>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: style.bg }]}>
          <Icon size={19} color={style.color} strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.rowTop}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowTime}>{item.time}</Text>
          </View>
          <Text style={styles.rowBody}>{item.body}</Text>
        </View>
      </View>
      {showDivider && <View style={styles.divider} />}
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
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  groupLabel: {
    fontSize: 12.5,
    fontFamily: font.semibold,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  row: { flexDirection: 'row', gap: 12, paddingVertical: 14 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  rowTitle: {
    fontSize: 13.5,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  rowTime: {
    fontSize: 11,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  rowBody: {
    marginTop: 2,
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: font.regular,
    color: colors.mutedForeground,
  },
  divider: { height: 1, backgroundColor: colors.border },
});
