import * as React from "react";
import { useColorScheme } from "react-native-appearance";
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from "react-native-paper";

import RootNavigator from "./RootNavigator";

import { PreferencesContext } from "context/preferencesContext";

export default function Navigation() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState<"light" | "dark">(
    colorScheme === "dark" ? "dark" : "light"
  );

  function toggleTheme() {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  }

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      theme,
    }),
    [theme]
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider
        theme={
          theme === "light"
            ? {
                ...DefaultTheme,
                colors: { ...DefaultTheme.colors, primary: "#1ba1f2" },
              }
            : {
                ...DarkTheme,
                colors: { ...DarkTheme.colors, primary: "#1ba1f2" },
              }
        }
      >
        <RootNavigator />
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}
