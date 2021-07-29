import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, FC } from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigation from 'routes';
import useCachedResources from 'hooks/useCachedResources';
import { AuthContextProvider } from 'providers/auth-provider';
import { PreferencesContextProvider } from 'providers/preferences-provider';

const App: FC = () => {
  const isLoadingComplete = useCachedResources();

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <PreferencesContextProvider>
          <AuthContextProvider>
            <Navigation />
            <StatusBar />
          </AuthContextProvider>
        </PreferencesContextProvider>
      </AppearanceProvider>
    </SafeAreaProvider>
  );
};

export default App;
