// src/services/location.service.ts
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { GOOGLE_MAPS_API_KEY, ANDROID_CERT_SHA1 } from '../config/env';

try {
  Geolocation.setRNConfiguration({
    // We request permission ourselves (below), so the library doesn't do a
    // second, fine-only request that would reject "Approximate" users.
    skipPermissionRequests: true,
    locationProvider: 'android',
  });
} catch (err) {
  console.warn('[location] config failed:', err);
}

export type Coordinates = { latitude: number; longitude: number };

export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  const FINE = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
  const COARSE = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;
  const result = await PermissionsAndroid.requestMultiple([FINE, COARSE]);
  return (
    result[FINE] === PermissionsAndroid.RESULTS.GRANTED ||
    result[COARSE] === PermissionsAndroid.RESULTS.GRANTED
  );
}

type PositionOptions = {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
};

function getPosition(options: PositionOptions): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      pos =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      err => reject(err),
      options,
    );
  });
}

export async function getCurrentPosition(): Promise<Coordinates> {
  try {
    // Network/Wi-Fi fix first: fast, works indoors, accurate enough for
    // "gyms near you". A cached fix up to 5 minutes old is fine.
    return await getPosition({
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 5 * 60 * 1000,
    });
  } catch (err: any) {
    console.warn('[location] network fix failed:', err?.code, err?.message);
    return await getPosition({
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    });
  }
}

// Shared Geocoding call. The two headers identify this app to Google so a
// key restricted to "Android apps" accepts REST requests from it.
async function geocodeRequest(query: string): Promise<any | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn(
      '[location] GOOGLE_MAPS_API_KEY is empty. Rebuild the app after editing .env files.',
    );
    return null;
  }
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${query}&key=${GOOGLE_MAPS_API_KEY}`,
      {
        headers: {
          'X-Android-Package': DeviceInfo.getBundleId(),
          'X-Android-Cert': ANDROID_CERT_SHA1,
        },
      },
    );
    const json = await res.json();
    if (json.status !== 'OK') {
      console.warn(
        '[location] geocode failed:',
        json.status,
        json.error_message ?? '',
      );
      return null;
    }
    return json;
  } catch (err) {
    console.warn('[location] geocode network error:', err);
    return null;
  }
}

export async function reverseGeocode(
  coords: Coordinates,
): Promise<string | null> {
  const json = await geocodeRequest(
    `latlng=${coords.latitude},${coords.longitude}`,
  );
  return json?.results?.[0]?.formatted_address ?? null;
}

export async function forwardGeocode(
  address: string,
): Promise<Coordinates | null> {
  const json = await geocodeRequest(`address=${encodeURIComponent(address)}`);
  const loc = json?.results?.[0]?.geometry?.location;
  return loc ? { latitude: loc.lat, longitude: loc.lng } : null;
}

export type DetectAddressResult =
  | { ok: true; address: string | null; location: Coordinates }
  | { ok: false; reason: 'permission-denied' | 'position-failed' };

export async function detectAddress(): Promise<DetectAddressResult> {
  const granted = await requestLocationPermission();
  if (!granted) return { ok: false, reason: 'permission-denied' };
  let location: Coordinates;
  try {
    location = await getCurrentPosition();
  } catch {
    return { ok: false, reason: 'position-failed' };
  }
  const address = await reverseGeocode(location);
  return { ok: true, address, location };
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function calculateDistanceKm(
  from: Coordinates,
  to: Coordinates,
): number {
  const R = 6371;
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function withComputedDistance<
  T extends { location?: Coordinates | null },
>(
  items: T[],
  userCoords: Coordinates | null,
): (T & { distanceKm: number | null; distance: string })[] {
  return items
    .map(item => {
      if (!userCoords || !item.location) {
        return {
          ...item,
          distanceKm: null,
          distance: (item as any).distance || '—',
        };
      }
      const distanceKm = calculateDistanceKm(userCoords, item.location);
      return { ...item, distanceKm, distance: formatDistance(distanceKm) };
    })
    .sort((a, b) => {
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    });
}
