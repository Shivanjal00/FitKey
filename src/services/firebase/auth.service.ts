// src/services/firebase/auth.service.ts
import {
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from '@react-native-firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  GeoPoint,
} from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { authInstance, db } from './index';

export async function googleAuth() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();

  if (response.type !== 'success' || !response.data?.idToken) {
    throw new Error('Google sign-in was cancelled.');
  }

  const credential = GoogleAuthProvider.credential(response.data.idToken);
  const result = await signInWithCredential(authInstance, credential);

  const profileRef = doc(db, 'users', result.user.uid);
  const profileSnap = await getDoc(profileRef);
  return { user: result.user, isNewUser: !profileSnap.exists() };
}

export async function completeRegistration(data: {
  name: string;
  phone: string;
  address: string;
  coords: { latitude: number; longitude: number } | null;
}) {
  const user = authInstance.currentUser;
  if (!user) throw new Error('No signed-in user.');
  await setDoc(
    doc(db, 'users', user.uid),
    {
      displayName: data.name,
      phoneNumber: data.phone || null,
      email: user.email ?? null,
      photoURL: user.photoURL ?? null,
      address: data.address,
      location: data.coords
        ? new GeoPoint(data.coords.latitude, data.coords.longitude)
        : null,
      locationCapturedAt: data.coords ? serverTimestamp() : null,
      tier: 'Standard',
      bookingsCount: 0,
      favoritesCount: 0,
      registrationComplete: true, // ← added — this is what checkUserStatus() actually checks
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
}
export function buildRegistrationParams(user: User) {
  return {
    phone: user.phoneNumber ?? null,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
  };
}

export async function checkUserStatus(
  uid: string,
): Promise<{ isRegistered: boolean }> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return { isRegistered: false };
  const data = snap.data() as { registrationComplete?: boolean } | undefined;
  return { isRegistered: !!data?.registrationComplete };
}
export async function signOutUser() {
  await firebaseSignOut(authInstance);
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(authInstance, callback);
}

// Updates the Firebase Auth profile and mirrors the same values into
// users/{uid}, which is what ProfileScreen reads first.
export async function updateUserProfile(
  user: User,
  data: { displayName: string; photoURL: string | null },
) {
  await updateProfile(user, {
    displayName: data.displayName,
    photoURL: data.photoURL,
  });
  await updateDoc(doc(db, 'users', user.uid), {
    displayName: data.displayName,
    photoURL: data.photoURL,
  });
}
