// src/data/libraries.ts
export type LibraryPlan = { name: string; price: number };

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
  plans: LibraryPlan[];
};

export const LIBRARY_FILTERS = [
  'All',
  'Silent Study',
  '24x7',
  'Coworking',
  'Exam Prep',
  'Wi-Fi',
];

export const LIBRARIES: Library[] = [
  {
    id: 'lib-1',
    name: 'The Quiet Quarter',
    area: 'Indiranagar',
    distance: '0.6 km',
    rating: 4.9,
    open: true,
    seats: 84,
    hours: '7:00 AM – 11:00 PM',
    tags: ['Silent Study', 'Wi-Fi'],
    image:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
    about:
      'A hushed, single-room reading hall with individually lit desks and zero phone-call zones. Built for people who need real silence to get real work done.',
    plans: [
      { name: 'Hourly Pass', price: 149 },
      { name: 'Daily Pass', price: 699 },
      { name: 'Monthly Pass', price: 3499 },
    ],
  },
  {
    id: 'lib-2',
    name: 'Atlas Reading Room',
    area: 'Koramangala',
    distance: '1.2 km',
    rating: 4.8,
    open: true,
    seats: 120,
    hours: '24 hours',
    tags: ['24x7', 'Coworking'],
    image:
      'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=900&q=80',
    about:
      'Open around the clock with flexible desk and lounge seating. Popular with night owls and anyone working across time zones.',
    plans: [
      { name: 'Hourly Pass', price: 199 },
      { name: 'Daily Pass', price: 899 },
      { name: 'Monthly Pass', price: 4499 },
    ],
  },
  {
    id: 'lib-3',
    name: "Meridian Scholars' Library",
    area: 'HSR Layout',
    distance: '2.4 km',
    rating: 4.7,
    open: false,
    seats: 96,
    hours: '8:00 AM – 10:00 PM',
    tags: ['Exam Prep', 'Silent Study'],
    image:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80',
    about:
      'Exam-season favorite — timed mock-test rooms, a dedicated doubt-clearing desk on weekends, and a no-talking policy strictly enforced.',
    plans: [
      { name: 'Hourly Pass', price: 129 },
      { name: 'Daily Pass', price: 599 },
      { name: 'Monthly Pass', price: 2999 },
    ],
  },
  {
    id: 'lib-4',
    name: 'Northlight Study Studio',
    area: 'Whitefield',
    distance: '3.8 km',
    rating: 4.6,
    open: true,
    seats: 60,
    hours: '6:00 AM – 12:00 AM',
    tags: ['Coworking', 'Wi-Fi'],
    image:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80',
    about:
      'Bright, plant-filled coworking-style floor with standing desks and a small café counter. A calmer alternative to a crowded café table.',
    plans: [
      { name: 'Hourly Pass', price: 179 },
      { name: 'Daily Pass', price: 799 },
      { name: 'Monthly Pass', price: 3999 },
    ],
  },
];
