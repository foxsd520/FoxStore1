import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppProvider, useAppSettings } from './src/context/AppContext';
import { navDarkTheme, navLightTheme, paperDarkTheme, paperLightTheme } from './src/theme/themes';
import './src/locales/i18n';
import RootNavigator from './src/navigation/RootNavigator';

function ThemedApp() {
  const { isDark } = useAppSettings();
  const { user } = useAuth();

  return (
    <PaperProvider theme={isDark ? paperDarkTheme : paperLightTheme}>
      <NavigationContainer theme={isDark ? navDarkTheme : navLightTheme}>
        <RootNavigator user={user} />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AuthProvider>
          <ThemedApp />
        </AuthProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
