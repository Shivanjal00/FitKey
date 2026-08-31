// src/services/firebase/firestore.service.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from '@react-native-firebase/firestore';
import { db } from './index';

export async function getCollection<T>(collectionName: string): Promise<T[]> {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T));
}

export async function getDocument<T>(
  collectionName: string,
  id: string,
): Promise<T | null> {
  const snapshot = await getDoc(doc(db, collectionName, id));
  if (!snapshot.exists()) return null; // exists() — a function call, not exists
  return { id: snapshot.id, ...snapshot.data() } as T;
}
