// src/components/QrPattern.tsx
import Svg, { Rect } from 'react-native-svg';
import { colors } from '../theme/colors';

// Deterministic decorative pattern — not a functioning scan code, purely visual
export default function QrPattern({ size = 160 }: { size?: number }) {
  const cell = size / 10;
  const seed = [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0];
  const cells = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      if ((seed[(r * 3 + c * 7) % seed.length] + r + c) % 3 === 0) {
        cells.push(
          <Rect
            key={`${r}-${c}`}
            x={c * cell}
            y={r * cell}
            width={cell - 1}
            height={cell - 1}
            fill={colors.foreground}
          />,
        );
      }
    }
  }
  const corner = size * 0.26;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {cells}
      <Rect
        x={0}
        y={0}
        width={corner}
        height={corner}
        fill="none"
        stroke={colors.foreground}
        strokeWidth={4}
      />
      <Rect
        x={size - corner}
        y={0}
        width={corner}
        height={corner}
        fill="none"
        stroke={colors.foreground}
        strokeWidth={4}
      />
      <Rect
        x={0}
        y={size - corner}
        width={corner}
        height={corner}
        fill="none"
        stroke={colors.foreground}
        strokeWidth={4}
      />
    </Svg>
  );
}
