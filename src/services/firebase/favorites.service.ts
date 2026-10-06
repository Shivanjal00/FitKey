// src/services/firebase/favorites.service.ts
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  increment,
} from '@react-native-firebase/firestore';
import { db } from './index';

export function subscribeToFavorites(
  uid: string,
  callback: (ids: Set<string>) => void,
): () => void {
  return onSnapshot(collection(db, 'users', uid, 'favorites'), snapshot => {
    callback(new Set(snapshot.docs.map(d => d.id)));
  });
}

export async function addFavorite(uid: string, gymId: string) {
  await setDoc(doc(db, 'users', uid, 'favorites', gymId), {
    addedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'users', uid), { favoritesCount: increment(1) });
}

export async function removeFavorite(uid: string, gymId: string) {
  await deleteDoc(doc(db, 'users', uid, 'favorites', gymId));
  await updateDoc(doc(db, 'users', uid), { favoritesCount: increment(-1) });
}
