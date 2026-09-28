// src/config/env.ts
import Config from 'react-native-config';

type Environment = 'development' | 'production';

export const ENV: Environment =
  (Config.ENVIRONMENT as Environment) ?? 'development';
export const IS_DEV = ENV === 'development';
export const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY ?? '';
export const ANDROID_CERT_SHA1 = (Config.ANDROID_CERT_SHA1 ?? '').replace(
  /:/g,
  '',
);
