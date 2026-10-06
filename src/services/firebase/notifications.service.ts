// src/services/firebase/notifications.service.ts
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from '@react-native-firebase/firestore';
import { db } from './index';
import type { NotificationItem } from '../../types/firestore.types'; // add this type the same way Booking was added

export function subscribeToNotifications(
  uid: string,
  callback: (items: NotificationItem[]) => void,
): () => void {
  const q = query(
    collection(db, 'users', uid, 'notifications'),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, snapshot => {
    callback(
      snapshot.docs.map(d => ({ id: d.id, ...d.data() } as NotificationItem)),
    );
  });
}
