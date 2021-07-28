import * as React from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native-appearance';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';

import { PreferencesContext } from 'context/preferencesContext';

import RootNavigator from './RootNavigator';

const Navigation: React.FC = () => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState<ColorSchemeName>(colorScheme);
  const { getItem: getScheme, setItem: setScheme } = useAsyncStorage('color_scheme');

  const readThemeSchemeFromStorage = async () => {
    const item = await getScheme();

    if (item) {
      setTheme(item as ColorSchemeName);
    }
  };

  const writeItemToStorage = async () => {
    const newValue = theme === 'dark' ? 'light' : 'dark';
    await setScheme(newValue);
    setTheme(newValue);
  };

  React.useEffect(() => {
    readThemeSchemeFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const preferences = React.useMemo(
    () => ({
      toggleTheme: writeItemToStorage,
      theme,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
