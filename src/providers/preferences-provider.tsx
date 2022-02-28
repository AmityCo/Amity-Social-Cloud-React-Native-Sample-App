import React, { FC, useCallback } from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
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

  const readThemeSchemeFromStorage = useCallback(async () => {
    const item = await getScheme();

    if (item) {
      setTheme(item as ColorSchemeName);
    }
  }, [getScheme]);

  const writeItemToStorage = async () => {
    const newValue = theme === 'dark' ? 'light' : 'dark';

    setScheme(newValue);
    setTheme(newValue);
  };

  React.useEffect(() => {
    readThemeSchemeFromStorage();
  }, [readThemeSchemeFromStorage]);

  return (
    <PreferencesContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
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
