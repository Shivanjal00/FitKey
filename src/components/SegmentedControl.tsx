// components/SegmentedControl.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { font } from '../theme/typography';

type Props = {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
};

export default function SegmentedControl({
  options,
  selectedIndex,
  onChange,
}: Props) {
  return (
    <View style={styles.wrap}>
      {options.map((option, i) => {
        const active = i === selectedIndex;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(i)}
            style={[styles.item, active && styles.itemActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {option}
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
    backgroundColor: '#F1F1EF',
    borderRadius: 16,
    padding: 4,
  },
  item: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  itemActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  label: {
    fontSize: 12.5,
    fontFamily: font.semibold,
    color: colors.mutedForeground,
  },
  labelActive: { color: colors.foreground },
});
