// src/types/firestore.types.ts
export type Plan = {
  name: string;
  price: number;
};

export type Gym = {
  id: string;
  name: string;
  area: string;
  distance: string;
  rating: number;
  reviews: number;
  open: boolean;
  price: number;
  category: string;
  tags: string[];
  image: string;
  gallery: string[];
  hours: string;
  about: string;
  trainer: string;
  plans: Plan[];
};

export type Library = {
  id: string;
  name: string;
  area: string;
  distance: string;
  rating: number;
  open: boolean;
  seats: number;
  hours: string;
  tags: string[];
  image: string;
  about: string;
  plans: Plan[];
};

// Mirrors the doc shape written by ensureUserProfile() in auth.service.ts.
export type UserProfile = {
  id: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  tier: string;
  bookingsCount: number;
  favoritesCount: number;
};
