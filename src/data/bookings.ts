// src/data/bookings.ts
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export type Booking = {
  id: string;
  gymId: string;
  planName: string;
  date: string;
  time: string;
  status: BookingStatus;
};

export const BOOKINGS: Booking[] = [
  {
    id: 'b1',
    gymId: '1',
    planName: 'Monthly Pass',
    date: 'Fri, 18 Jul',
    time: '6:00 AM',
    status: 'upcoming',
  },
  {
    id: 'b2',
    gymId: '2',
    planName: 'Daily Pass',
    date: 'Sat, 19 Jul',
    time: '7:30 AM',
    status: 'upcoming',
  },
  {
    id: 'b3',
    gymId: '5',
    planName: 'Daily Pass',
    date: '2 Jul',
    time: '6:30 AM',
    status: 'completed',
  },
  {
    id: 'b4',
    gymId: '4',
    planName: 'Weekly Pass',
    date: '28 Jun',
    time: '7:00 AM',
    status: 'completed',
  },
  {
    id: 'b5',
    gymId: '3',
    planName: 'Monthly Pass',
    date: '15 Jun',
    time: '8:00 AM',
    status: 'completed',
  },
  {
    id: 'b6',
    gymId: '6',
    planName: 'Daily Pass',
    date: '10 Jun',
    time: '6:00 PM',
    status: 'cancelled',
  },
];
