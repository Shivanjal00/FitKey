// src/navigation/RootNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import TabNavigator from './TabNavigator';
import GymDetailsScreen from '../screens/GymDetailsScreen';
import SelectSlotScreen from '../screens/SelectSlotScreen';
import BookingSummaryScreen from '../screens/BookingSummaryScreen';
import PaymentScreen from '../screens/PaymentScreen';
import BookingStatusScreen from '../screens/BookingStatusScreen';
import SearchScreen from '../screens/SearchScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Otp: { phone: string };
  MainTabs:
    | { screen?: 'Home' | 'Bookings' | 'Favorites' | 'Profile' }
    | undefined;
  GymDetails: { gymId: string };
  SelectSlot: { gymId: string; planIndex: number };
  BookingSummary: { gymId: string; planIndex: number; slot: string };
  Payment: { gymId: string; planIndex: number; slot: string; total: number };
  BookingStatus: { gymId: string };
  Search: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="GymDetails" component={GymDetailsScreen} />
      <Stack.Screen name="SelectSlot" component={SelectSlotScreen} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BookingStatus" component={BookingStatusScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
