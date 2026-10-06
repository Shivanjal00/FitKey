// src/store/FavoritesContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from 'react';
import { subscribeToAuthState } from '../services/firebase/auth.service';
import {
  subscribeToFavorites,
  addFavorite,
  removeFavorite,
} from '../services/firebase/favorites.service';

type FavoritesContextValue = {
  favorites: Set<string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [uid, setUid] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => subscribeToAuthState(user => setUid(user?.uid ?? null)), []);

  useEffect(() => {
    if (!uid) {
      setFavorites(new Set());
      return;
    }
    return subscribeToFavorites(uid, setFavorites);
  }, [uid]);

  const toggleFavorite = async (id: string) => {
    if (!uid) return;
    const wasFavorite = favorites.has(id);
    setFavorites(prev => {
      const next = new Set(prev);
      wasFavorite ? next.delete(id) : next.add(id);
      return next;
    });
    try {
      wasFavorite ? await removeFavorite(uid, id) : await addFavorite(uid, id);
    } catch (err) {
      console.warn('[favorites] write failed, reverting:', err);
      setFavorites(prev => {
        const next = new Set(prev);
        wasFavorite ? next.add(id) : next.delete(id);
        return next;
      });
    }
  };

  const value = useMemo(
    () => ({
      favorites,
      isFavorite: (id: string) => favorites.has(id),
      toggleFavorite,
    }),
    [favorites, uid],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
