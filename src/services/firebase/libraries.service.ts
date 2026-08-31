// src/services/firebase/libraries.service.ts
import { getCollection, getDocument } from './firestore.service';
import type { Library } from '../../types/firestore.types';

export const getLibraries = () => getCollection<Library>('libraries');
export const getLibraryById = (id: string) =>
  getDocument<Library>('libraries', id);
