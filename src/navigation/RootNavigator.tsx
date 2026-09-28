// src/navigation/RootNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
// import OtpScreen from '../screens/OtpScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import TabNavigator from './TabNavigator';
import GymDetailsScreen from '../screens/GymDetailsScreen';
import SelectSlotScreen from '../screens/SelectSlotScreen';
import BookingSummaryScreen from '../screens/BookingSummaryScreen';
// import PaymentScreen from '../screens/PaymentScreen'; // disabled — see PaymentScreen.tsx
import BookingStatusScreen from '../screens/BookingStatusScreen';
import SearchScreen from '../screens/SearchScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import LibraryDetailsScreen from '../screens/LibraryDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  // Otp: { phone: string };
  // Each field is null when that piece of info wasn't provided by whichever
  // auth method got the user here — phone signups arrive with phone set and
  // email null, Google signups the reverse. RegistrationScreen locks
  // whichever field came in non-null and requires the other.
  Registration: {
    phone: string | null;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
  MainTabs:
    | { screen?: 'Gyms' | 'Libraries' | 'Bookings' | 'Favorites' | 'Profile' }
    | undefined;
  GymDetails: { gymId: string };
  SelectSlot: { gymId: string; planIndex: number };
  BookingSummary: { gymId: string; planIndex: number; slot: string };
  // Payment: { gymId: string; planIndex: number; slot: string; total: number }; // disabled
  BookingStatus: { gymId: string };
  Search: undefined;
  Notifications: undefined;
  LibraryDetails: { libraryId: string };
  EditProfile: { displayName: string; photoURL: string | null };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="LibraryDetails" component={LibraryDetailsScreen} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="Otp" component={OtpScreen} /> */}
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="GymDetails" component={GymDetailsScreen} />
      <Stack.Screen name="SelectSlot" component={SelectSlotScreen} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
      {/* <Stack.Screen name="Payment" component={PaymentScreen} /> */}
      <Stack.Screen name="BookingStatus" component={BookingStatusScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
