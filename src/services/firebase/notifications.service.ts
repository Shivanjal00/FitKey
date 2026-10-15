import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  writeBatch,
} from '@react-native-firebase/firestore';
import { db } from './index';
import type { NotificationItem } from '../../types/firestore.types';

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

export async function markAllNotificationsRead(uid: string, ids: string[]) {
  if (ids.length === 0) return;
  const batch = writeBatch(db);
  ids.forEach(id =>
    batch.update(doc(db, 'users', uid, 'notifications', id), { read: true }),
  );
  await batch.commit();
}
