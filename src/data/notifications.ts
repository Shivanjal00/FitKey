// src/data/notifications.ts
export type NotificationItem = {
  id: string;
  icon: 'check-circle' | 'tag' | 'x-circle' | 'calendar-clock' | 'sparkles';
  title: string;
  body: string;
  time: string;
  group: 'Today' | 'Earlier';
};

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    icon: 'check-circle',
    title: 'Booking approved',
    body: 'Iron Circuit — Cyber Hub confirmed your slot for 6:00 AM tomorrow.',
    time: '10m ago',
    group: 'Today',
  },
  {
    id: 'n2',
    icon: 'tag',
    title: 'Nearby offer',
    body: '20% off Monthly Pass at SheFit Studio, this week only.',
    time: '2h ago',
    group: 'Today',
  },
  {
    id: 'n3',
    icon: 'x-circle',
    title: 'Booking rejected',
    body: "The Grind House couldn't verify your payment. Amount will be refunded.",
    time: 'Yesterday',
    group: 'Earlier',
  },
  {
    id: 'n4',
    icon: 'calendar-clock',
    title: 'Membership reminder',
    body: 'Your Monthly Pass at Zenith CrossFit expires in 3 days.',
    time: '2 days ago',
    group: 'Earlier',
  },
  {
    id: 'n5',
    icon: 'sparkles',
    title: 'Exclusive promotion',
    body: 'Refer a friend and get a free Daily Pass on your next visit.',
    time: '4 days ago',
    group: 'Earlier',
  },
];
