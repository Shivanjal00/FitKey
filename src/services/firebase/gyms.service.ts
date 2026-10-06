// src/services/firebase/gyms.service.ts
import { getCollection, getDocument } from './firestore.service';
import type { Gym } from '../../types/firestore.types';
import {
  collection,
  query,
  where,
  documentId,
  getDocs,
} from '@react-native-firebase/firestore';

import { db } from './index';

export const getGyms = () => getCollection<Gym>('gyms');
export const getGymById = (id: string) => getDocument<Gym>('gyms', id);
export async function getGymsByIds(ids: string[]): Promise<Gym[]> {
  if (ids.length === 0) return [];
  // Firestore's 'in' operator caps at 30 values — more than enough for a favorites list.
  const q = query(
    collection(db, 'gyms'),
    where(documentId(), 'in', ids.slice(0, 30)),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Gym));
}
