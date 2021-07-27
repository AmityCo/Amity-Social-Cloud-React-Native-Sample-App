import * as React from 'react';
import { useColorScheme } from 'react-native-appearance';
import { Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';

import { PreferencesContext } from 'context/preferencesContext';

import RootNavigator from './RootNavigator';

const Navigation: React.FC = () => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState<'light' | 'dark'>(
    colorScheme === 'dark' ? 'dark' : 'light',
  );

  function toggleTheme() {
    setTheme(theme_ => (theme_ === 'light' ? 'dark' : 'light'));
  }

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      theme,
    }),
    [theme],
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider
        theme={
          theme === 'light'
            ? {
                ...DefaultTheme,
                colors: { ...DefaultTheme.colors, primary: '#1ba1f2' },
              }
            : {
                ...DarkTheme,
                colors: { ...DarkTheme.colors, primary: '#1ba1f2' },
              }
        }
      >
        <RootNavigator />
      </PaperProvider>
    </PreferencesContext.Provider>
  );
};

export default Navigation;
