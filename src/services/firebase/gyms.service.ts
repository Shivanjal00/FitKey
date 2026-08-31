// src/services/firebase/gyms.service.ts
import { getCollection, getDocument } from './firestore.service';
import type { Gym } from '../../types/firestore.types';

export const getGyms = () => getCollection<Gym>('gyms');
export const getGymById = (id: string) => getDocument<Gym>('gyms', id);
