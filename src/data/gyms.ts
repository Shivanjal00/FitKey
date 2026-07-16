// data/gyms.ts
export type Plan = { name: string; price: number };

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

export const GYMS: Gym[] = [
  {
    id: '1',
    name: 'Iron Circuit — Cyber Hub',
    area: 'Cyber Hub, DLF Phase 2',
    distance: '0.8 km',
    rating: 4.8,
    reviews: 342,
    open: true,
    price: 249,
    category: 'Strength',
    tags: ['AC', 'Shower', 'Locker', 'Trainer'],
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    ],
    hours: '5:00 AM – 11:00 PM',
    about:
      'A full-strength training floor with free weights, plate-loaded machines and a dedicated conditioning zone. Quiet, well-spaced and built for serious sessions.',
    trainer: 'Certified strength coaches on floor 7 AM – 9 PM',
    plans: [
      { name: 'Daily Pass', price: 249 },
      { name: 'Weekly Pass', price: 899 },
      { name: 'Monthly Pass', price: 2499 },
    ],
  },
  {
    id: '2',
    name: 'Zenith CrossFit Gurugram',
    area: 'Sector 29, Gurugram',
    distance: '1.4 km',
    rating: 4.9,
    reviews: 518,
    open: true,
    price: 399,
    category: 'CrossFit',
    tags: ['AC', 'Locker', 'Trainer', 'Parking'],
    image:
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=80',
    ],
    hours: '6:00 AM – 10:00 PM',
    about:
      'High-ceiling box with rigs, sleds and a full range of Olympic lifting platforms. Every session is coached — no walking in cold.',
    trainer: 'Coached WODs every hour, all levels welcome',
    plans: [
      { name: 'Daily Pass', price: 399 },
      { name: 'Weekly Pass', price: 1299 },
      { name: 'Monthly Pass', price: 3999 },
    ],
  },
  {
    id: '3',
    name: 'SheFit Studio',
    area: 'Golf Course Road',
    distance: '2.1 km',
    rating: 4.7,
    reviews: 210,
    open: true,
    price: 299,
    category: 'Women Only',
    tags: ['Women Only', 'AC', 'Locker', 'Shower'],
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
    ],
    hours: '6:00 AM – 9:00 PM',
    about:
      'A calm, women-only floor with functional training, dance cardio and recovery rooms. Private changing suites included.',
    trainer: 'All-women trainer team',
    plans: [
      { name: 'Daily Pass', price: 299 },
      { name: 'Weekly Pass', price: 999 },
      { name: 'Monthly Pass', price: 2899 },
    ],
  },
  {
    id: '4',
    name: 'Yogic Living',
    area: 'Sushant Lok',
    distance: '1.9 km',
    rating: 4.9,
    reviews: 156,
    open: false,
    price: 199,
    category: 'Yoga',
    tags: ['AC', 'Locker'],
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=1200&q=80',
    ],
    hours: '6:00 AM – 8:00 PM',
    about:
      'Natural light, warm wooden floors and a slow-paced practice space for Hatha, Vinyasa and breathwork sessions.',
    trainer: 'RYT-certified instructors, small batch sizes',
    plans: [
      { name: 'Daily Pass', price: 199 },
      { name: 'Weekly Pass', price: 699 },
      { name: 'Monthly Pass', price: 1999 },
    ],
  },
  {
    id: '5',
    name: 'PowerHouse Gym',
    area: 'Sector 14, Gurugram',
    distance: '3.2 km',
    rating: 4.6,
    reviews: 289,
    open: true,
    price: 179,
    category: 'Cardio',
    tags: ['AC', 'Parking', 'Shower'],
    image:
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=1200&q=80',
    ],
    hours: '5:30 AM – 10:30 PM',
    about:
      'A classic, no-frills training floor with a strong cardio bank and ample free weights for everyday sessions.',
    trainer: 'Floor trainers available on request',
    plans: [
      { name: 'Daily Pass', price: 179 },
      { name: 'Weekly Pass', price: 599 },
      { name: 'Monthly Pass', price: 1799 },
    ],
  },
  {
    id: '6',
    name: 'The Grind House',
    area: 'DLF Phase 4',
    distance: '2.6 km',
    rating: 4.8,
    reviews: 402,
    open: true,
    price: 349,
    category: 'Strength',
    tags: ['AC', 'Locker', 'Trainer', 'Shower'],
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    ],
    hours: '5:00 AM – 11:30 PM',
    about:
      'Boutique strength floor with competition platforms, a dedicated warm-up zone and unhurried peak hours.',
    trainer: 'Powerlifting and hypertrophy coaches',
    plans: [
      { name: 'Daily Pass', price: 349 },
      { name: 'Weekly Pass', price: 1199 },
      { name: 'Monthly Pass', price: 3499 },
    ],
  },
];

export const CATEGORIES = [
  'Daily Pass',
  'Monthly Pass',
  'CrossFit',
  'Yoga',
  'Women Only',
  'Strength',
  'Cardio',
];

export const FACILITY_ICON: Record<string, string> = {
  AC: 'wind',
  Shower: 'shower-head',
  Locker: 'lock',
  Trainer: 'dumbbell',
  Parking: 'car',
  'Women Only': 'user',
};
// src/data/gyms.ts — add this export alongside CATEGORIES
export const FILTERS = [
  'Distance',
  'Price',
  'Rating',
  'Open Now',
  'Parking',
  'AC',
  'Locker',
  'Shower',
  'Women Only',
  'Personal Trainer',
];
