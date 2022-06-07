import React, { FC, useCallback, useState } from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import type { PreferencesContextInterface } from 'types';

export const PreferencesContext = React.createContext<PreferencesContextInterface>({
  apiKey: '',
  apiRegion: '',
  theme: 'light',
  toggleTheme: () => {
    //
  },
  setClientCredentials: () => {
    //
  },
});

export const PreferencesContextProvider: FC = ({ children }) => {
  const [apiKey, setApiKey] = useState('');
  const [apiRegion, setSetApiRegion] = useState('');

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

  const setClientCredentials = (apiKey_: string, apiRegion_: string) => {
    setApiKey(apiKey_);
    setSetApiRegion(apiRegion_);
  };

  React.useEffect(() => {
    readThemeSchemeFromStorage();
  }, [readThemeSchemeFromStorage]);

  return (
    <PreferencesContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        theme,
        apiKey,
        apiRegion,
        setClientCredentials,
        toggleTheme: writeItemToStorage,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesContext;
