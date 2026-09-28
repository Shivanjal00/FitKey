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
  location: { latitude: number; longitude: number } | null;
  address: string | null;
  phone: string | null;
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
  location: { latitude: number; longitude: number } | null;
  address: string | null;
  phone: string | null;
};

// Mirrors the doc shape written by completeRegistration() in auth.service.ts.
export type UserProfile = {
  id: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  photoURL: string | null;
  address: string | null;
  gender: string | null;
  location: { latitude: number; longitude: number } | null;
  registrationComplete: boolean;
  tier: string;
  bookingsCount: number;
  favoritesCount: number;
};
