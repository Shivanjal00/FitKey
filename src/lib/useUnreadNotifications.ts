import { useEffect, useState } from 'react';
import { authInstance } from '../services/firebase';
import { subscribeToNotifications } from '../services/firebase/notifications.service';

export function useUnreadNotifications(): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const uid = authInstance.currentUser?.uid;
    if (!uid) return;
    return subscribeToNotifications(uid, items =>
      setCount(items.filter(n => !n.read).length),
    );
  }, []);
  return count;
}
