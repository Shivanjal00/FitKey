import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Tag,
  XCircle,
  CalendarClock,
  Sparkles,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';
import { authInstance } from '../services/firebase';
import {
  subscribeToNotifications,
  markAllNotificationsRead,
} from '../services/firebase/notifications.service';
import type {
  NotificationItem,
  NotificationType,
} from '../types/firestore.types';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const TYPE_STYLE: Record<
  NotificationType,
  { Icon: any; bg: string; color: string }
> = {
  booking_approved: {
    Icon: CheckCircle2,
    bg: `${colors.success}1A`,
    color: colors.success,
  },
  booking_rejected: {
    Icon: XCircle,
    bg: `${colors.error}1A`,
    color: colors.error,
  },
  booking_reminder: {
    Icon: CalendarClock,
    bg: `${colors.warn}1A`,
    color: colors.warn,
  },
  nearby_offer: { Icon: Tag, bg: `${colors.accent}1A`, color: colors.accent },
  promotion: { Icon: Sparkles, bg: `${colors.accent}1A`, color: colors.accent },
};
const FALLBACK_STYLE = {
  Icon: Bell,
  bg: `${colors.accent}1A`,
  color: colors.accent,
};

// createdAt is briefly null on the device that just wrote it (pending server timestamp).
function toDate(item: NotificationItem): Date {
  const ts: any = item.createdAt;
  return ts?.toDate ? ts.toDate() : new Date();
}

function timeAgo(d: Date): string {
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

export default function NotificationsScreen({ navigation }: Props) {
  const insets = useSafeInsets();
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const [freshIds, setFreshIds] = useState<Set<string> | null>(null);

  useEffect(() => {
    const uid = authInstance.currentUser?.uid;
    if (!uid) {
      setItems([]);
      return;
    }
    return subscribeToNotifications(uid, setItems);
  }, []);

  // Remember which ones were unread when the screen opened, so they stay highlighted.
  useEffect(() => {
    if (items && freshIds === null) {
      setFreshIds(new Set(items.filter(n => !n.read).map(n => n.id)));
    }
  }, [items, freshIds]);

  // Opening the screen counts as reading everything on it.
  useEffect(() => {
    const uid = authInstance.currentUser?.uid;
    if (!uid || !items) return;
    const unread = items.filter(n => !n.read).map(n => n.id);
    if (unread.length > 0) {
      markAllNotificationsRead(uid, unread).catch(err =>
        console.warn('[notifications] mark read failed:', err),
      );
    }
  }, [items]);

  const today = (items ?? []).filter(
    n => toDate(n).toDateString() === new Date().toDateString(),
  );
  const earlier = (items ?? []).filter(
    n => toDate(n).toDateString() !== new Date().toDateString(),
  );

  const renderGroup = (label: string, group: NotificationItem[]) =>
    group.length > 0 && (
      <View key={label}>
        <Text style={styles.groupLabel}>{label}</Text>
        {group.map((n, i) => {
          const s = TYPE_STYLE[n.type] ?? FALLBACK_STYLE;
          const Icon = s.Icon;
          return (
            <View key={n.id}>
              <View style={styles.row}>
                <View style={[styles.iconWrap, { backgroundColor: s.bg }]}>
                  <Icon size={19} color={s.color} strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.rowTop}>
                    <Text style={styles.rowTitle}>{n.title}</Text>
                    <Text style={styles.rowTime}>{timeAgo(toDate(n))}</Text>
                  </View>
                  <Text style={styles.rowBody}>{n.body}</Text>
                </View>
                {freshIds?.has(n.id) && <View style={styles.unreadDot} />}
              </View>
              {i < group.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}
      </View>
    );

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

      {items === null ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : items.length === 0 ? (
        <View style={styles.emptyState}>
          <Bell size={32} color={colors.borderStrong} />
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptySubtitle}>
            Booking confirmations and updates will show up here.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {renderGroup('Today', today)}
          {renderGroup('Earlier', earlier)}
        </ScrollView>
      )}
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
    marginTop: 12,
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
    flex: 1,
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
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginTop: 6,
  },
  divider: { height: 1, backgroundColor: colors.border },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 14,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  emptySubtitle: {
    fontSize: 12.5,
    fontFamily: font.regular,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
});
