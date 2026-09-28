// src/store/UserLocationContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  requestLocationPermission,
  getCurrentPosition,
  reverseGeocode,
  type Coordinates,
} from '../services/location.service';

type UserLocationContextValue = {
  coords: Coordinates | null;
  address: string | null;
  loading: boolean;
  permissionDenied: boolean;
  refresh: () => void;
};

const UserLocationContext = createContext<UserLocationContextValue | null>(
  null,
);

export function UserLocationProvider({ children }: { children: ReactNode }) {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const fetchLocation = async () => {
    setLoading(true);
    try {
      const granted = await requestLocationPermission();
      console.log('[location] permission granted:', granted);
      if (!granted) {
        setPermissionDenied(true);
        return;
      }
      setPermissionDenied(false);

      const position = await getCurrentPosition();
      console.log(
        '[location] got position:',
        position.latitude.toFixed(3),
        position.longitude.toFixed(3),
      );
      setCoords(position); // distances work from here, even if the address lookup fails

      const label = await reverseGeocode(position);
      console.log('[location] reverse geocode:', label ? 'ok' : 'failed');
      setAddress(label);
    } catch (err: any) {
      console.warn('[location] failed:', err?.code, err?.message ?? err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserLocationContext.Provider
      value={{
        coords,
        address,
        loading,
        permissionDenied,
        refresh: fetchLocation,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
}

export function useUserLocation() {
  const ctx = useContext(UserLocationContext);
  if (!ctx)
    throw new Error('useUserLocation must be used within UserLocationProvider');
  return ctx;
}
