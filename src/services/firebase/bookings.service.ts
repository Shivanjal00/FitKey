// src/services/firebase/bookings.service.ts
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  increment,
} from '@react-native-firebase/firestore';
import { db } from './index';
import { getDocument } from './firestore.service';
import type { Booking, BookingStatus } from '../../types/firestore.types';

export async function createBooking(data: {
  userId: string;
  gymId: string;
  gymNameSnapshot: string;
  gymImageSnapshot: string;
  planName: string;
  slotDate: Date;
  slotTime: string;
}): Promise<string> {
  const ref = doc(collection(db, 'bookings'));
  await setDoc(ref, {
    userId: data.userId,
    gymId: data.gymId,
    gymNameSnapshot: data.gymNameSnapshot,
    gymImageSnapshot: data.gymImageSnapshot,
    planName: data.planName,
    slotDate: data.slotDate,
    slotTime: data.slotTime,
    status: 'upcoming' as BookingStatus,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'users', data.userId), {
    bookingsCount: increment(1),
  });
  return ref.id;
}

export function subscribeToUserBookings(
  userId: string,
  callback: (bookings: Booking[]) => void,
): () => void {
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, snapshot => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));
  });
}

export const getBookingById = (id: string) =>
  getDocument<Booking>('bookings', id);
