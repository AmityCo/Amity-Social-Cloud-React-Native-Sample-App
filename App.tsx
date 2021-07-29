import 'react-native-gesture-handler';
import React, { FC } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppearanceProvider } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigation from 'routes';
import useCachedResources from 'hooks/useCachedResources';
import { PreferencesContextProvider } from 'providers/preferences-provider';

const App: FC = () => {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <PreferencesContextProvider>
          <Navigation />
          <StatusBar />
        </PreferencesContextProvider>
      </AppearanceProvider>
    </SafeAreaProvider>
  );
};

export default App;
