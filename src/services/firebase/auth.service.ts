// src/services/firebase/auth.service.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as updateAuthProfile,
  type FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { authInstance, db } from './index';

// Creates a users/{uid} profile doc the first time someone signs in,
// regardless of whether they came through email/password or Google —
// every account ends up with exactly one profile doc, created here once.
// Failures here are logged but never thrown: the auth session is already
// valid by the time this runs, so a Firestore blip (offline, rules, etc.)
// should not block sign-in. The doc can be created lazily on a later call.
async function ensureUserProfile(user: FirebaseAuthTypes.User) {
  try {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        displayName:
          user.displayName ?? user.email?.split('@')[0] ?? 'FitKey User',
        email: user.email ?? null,
        photoURL: user.photoURL ?? null,
        tier: 'Standard',
        bookingsCount: 0,
        favoritesCount: 0,
        createdAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.warn('[auth] ensureUserProfile failed (non-fatal):', err);
  }
}

// Tries sign-in first; if the account genuinely doesn't exist yet, creates
// it instead. This is what lets LoginScreen have just one email/password
// form with one button, rather than separate Sign Up / Log In screens.
//
// Note: modern Firebase Auth returns the same 'auth/invalid-credential'
// code for both "no such account" and "wrong password" (an intentional
// anti-enumeration measure), so we can't tell those apart up front. We
// optimistically try to create the account; if THAT fails with
// 'auth/email-already-in-use', the account was real and the password was
// simply wrong — we re-throw as a clean wrong-password error instead of
// letting the confusing "email already in use" message leak through.
export async function emailAuth(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const result = await signInWithEmailAndPassword(
      authInstance,
      normalizedEmail,
      password,
    );
    await ensureUserProfile(result.user);
    return result.user;
  } catch (err: any) {
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/invalid-credential'
    ) {
      try {
        const result = await createUserWithEmailAndPassword(
          authInstance,
          normalizedEmail,
          password,
        );
        await ensureUserProfile(result.user);
        return result.user;
      } catch (createErr: any) {
        if (createErr.code === 'auth/email-already-in-use') {
          const wrongPasswordErr: any = new Error(
            'Incorrect email or password.',
          );
          wrongPasswordErr.code = 'auth/wrong-password';
          throw wrongPasswordErr;
        }
        throw createErr;
      }
    }
    throw err;
  }
}

export async function googleAuth() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();

  if (response.type !== 'success' || !response.data?.idToken) {
    const cancelledErr: any = new Error('Google sign-in was cancelled.');
    cancelledErr.code = 'SIGN_IN_CANCELLED';
    throw cancelledErr;
  }

  const credential = GoogleAuthProvider.credential(response.data.idToken);
  const result = await signInWithCredential(authInstance, credential);
  await ensureUserProfile(result.user);
  return result.user;
}

export async function signOutUser() {
  await firebaseSignOut(authInstance);
}

// Updates both the Firebase Auth user object AND the Firestore users/{uid}
// doc. Both need to change together: ProfileScreen reads the Firestore doc
// as the source of truth but falls back to the Auth user object while the
// doc is loading, so letting them drift would show stale data briefly on
// every screen that reads either one.
export async function updateUserProfile(
  user: FirebaseAuthTypes.User,
  updates: { displayName?: string; photoURL?: string | null },
) {
  await updateAuthProfile(user, updates);
  const ref = doc(db, 'users', user.uid);
  await updateDoc(ref, {
    ...(updates.displayName !== undefined && {
      displayName: updates.displayName,
    }),
    ...(updates.photoURL !== undefined && { photoURL: updates.photoURL }),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToAuthState(
  callback: (user: FirebaseAuthTypes.User | null) => void,
) {
  return onAuthStateChanged(authInstance, callback);
}
