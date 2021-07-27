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

  const themeObj =
    theme === 'light'
      ? {
          ...DefaultTheme,
          colors: { ...DefaultTheme.colors, primary: '#05be8b' },
        }
      : {
          ...DarkTheme,
          colors: { ...DarkTheme.colors, primary: '#05be8b' },
        };

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={themeObj}>
        <RootNavigator />
      </PaperProvider>
    </PreferencesContext.Provider>
  );
};

export default Navigation;
