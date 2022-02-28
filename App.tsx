import { StatusBar } from 'expo-status-bar';
import React, { useEffect, FC } from 'react';
import { LogBox, StyleSheet } from 'react-native';
import polyfill from '@amityco/react-native-formdata-polyfill';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
    <GestureHandlerRootView style={styles.root}>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
