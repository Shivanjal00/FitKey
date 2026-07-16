// lib/useSafeInsets.ts
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useSafeInsets() {
  const insets = useSafeAreaInsets();
  return {
    top: Math.max(insets.top, 20),
    bottom: Math.max(insets.bottom, 24),
  };
}
