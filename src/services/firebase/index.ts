// src/services/firebase/index.ts
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const app = getApp();

export const authInstance = getAuth(app);
export const db = getFirestore(app);

const isDev = DeviceInfo.getBundleId().endsWith('.dev');

GoogleSignin.configure({
  webClientId: isDev
    ? '1606622132-17cd1s30qjl7l4ull8bc7bmdocsq9t65.apps.googleusercontent.com'
    : '806947013885-ktoojrr176pcr53bi6bki366i0f76tkp.apps.googleusercontent.com',
});

export const IS_DEV_ENVIRONMENT = isDev;
