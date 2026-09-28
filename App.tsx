// App.tsx
import 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { FavoritesProvider } from './src/store/FavoritesContext';
import { colors } from './src/theme/colors';
// App.tsx — one line near your other imports, at the top
import './src/services/firebase';
import { UserLocationProvider } from './src/store/UserLocationContext';

import { authInstance, IS_DEV_ENVIRONMENT } from './src/services/firebase';
console.log(
  'Firebase connected:',
  authInstance.app.name,
  '| dev mode:',
  IS_DEV_ENVIRONMENT,
);

export default function App() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <UserLocationProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={colors.background}
            translucent
          />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </UserLocationProvider>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}
