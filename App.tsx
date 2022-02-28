import { GestureHandlerRootView } from 'react-native-gesture-handler';
import polyfill from '@amityco/react-native-formdata-polyfill';

import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, FC } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigation from 'routes';
import useCachedResources from 'hooks/useCachedResources';
import { AuthContextProvider } from 'providers/auth-provider';
import { PreferencesContextProvider } from 'providers/preferences-provider';
import Theme from './Theme';

polyfill();

const App: FC = () => {
  const isLoadingComplete = useCachedResources();

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <PreferencesContextProvider>
          <AuthContextProvider>
            <Theme>
              <Navigation />
              <StatusBar />
            </Theme>
          </AuthContextProvider>
        </PreferencesContextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
