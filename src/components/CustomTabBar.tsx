// components/CustomTabBar.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  Dumbbell,
  Library,
  CalendarCheck,
  Heart,
  User,
} from 'lucide-react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';
import { useSafeInsets } from '../lib/useSafeInsets';

const ICONS = {
  Gyms: Dumbbell,
  Libraries: Library,
  Bookings: CalendarCheck,
  Favorites: Heart,
  Profile: User,
} as const;

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const Icon = ICONS[route.name as keyof typeof ICONS];

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.item}
          >
            <Icon
              size={22}
              color={focused ? colors.foreground : colors.mutedForeground}
              strokeWidth={focused ? 2 : 1.6}
            />
            <Text
              style={[
                styles.label,
                { color: focused ? colors.foreground : colors.mutedForeground },
              ]}
            >
              {route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  item: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  label: { fontSize: 10.5, fontFamily: font.medium },
});
