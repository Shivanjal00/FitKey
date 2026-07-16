// components/icons/GoogleIcon.tsx
import Svg, { Path } from 'react-native-svg';

export default function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.42 3.58v3h3.91c2.29-2.11 3.53-5.21 3.53-8.82z"
      />
      <Path
        fill="#34A853"
        d="M12 24c3.27 0 6.01-1.08 8.01-2.92l-3.91-3c-1.08.73-2.47 1.16-4.1 1.16-3.15 0-5.82-2.13-6.77-4.99H1.2v3.09C3.19 21.3 7.26 24 12 24z"
      />
      <Path
        fill="#FBBC05"
        d="M5.23 14.25c-.24-.73-.38-1.5-.38-2.25s.14-1.52.38-2.25V6.66H1.2C.44 8.24 0 10.06 0 12s.44 3.76 1.2 5.34l4.03-3.09z"
      />
      <Path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C18 1.18 15.27 0 12 0 7.26 0 3.19 2.7 1.2 6.66l4.03 3.09C6.18 6.88 8.85 4.75 12 4.75z"
      />
    </Svg>
  );
}
