// components/PrimaryButton.tsx
import { useRef } from 'react';
import { Text, Pressable, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';

type Props = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
  style?: ViewStyle;
};

export default function PrimaryButton({
  label,
  onPress,
  icon,
  disabled,
  variant = 'solid',
  style,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.timing(scale, {
      toValue: 0.99,
      duration: 80,
      useNativeDriver: true,
    }).start();
  const pressOut = () =>
    Animated.timing(scale, {
      toValue: 1,
      duration: 80,
      useNativeDriver: true,
    }).start();

  const isOutline = variant === 'outline';

  return (
    <Animated.View
      style={{ transform: [{ scale }], opacity: disabled ? 0.4 : 1 }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled}
        style={[styles.base, isOutline ? styles.outline : styles.solid, style]}
      >
        {icon}
        <Text style={isOutline ? styles.outlineText : styles.solidText}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  solid: { backgroundColor: colors.foreground },
  solidText: {
    fontSize: 15,
    fontFamily: font.semibold,
    color: colors.primaryForeground,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlineText: {
    fontSize: 14.5,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
});
