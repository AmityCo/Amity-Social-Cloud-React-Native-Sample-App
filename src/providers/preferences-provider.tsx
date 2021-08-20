import React, { FC } from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native-appearance';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import type { PreferencesContextInterface } from 'types';

export const PreferencesContext = React.createContext<PreferencesContextInterface>({
  theme: 'light',
  toggleTheme: () => {
    //
  },
});

export const PreferencesContextProvider: FC = ({ children }) => {
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

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        toggleTheme: writeItemToStorage,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesContext;
