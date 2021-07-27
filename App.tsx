import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { AppearanceProvider } from "react-native-appearance";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Navigation from "routes";

import useCachedResources from "hooks/useCachedResources";

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <AppearanceProvider>
          <Navigation />
          <StatusBar />
        </AppearanceProvider>
      </SafeAreaProvider>
    );
  }
}
