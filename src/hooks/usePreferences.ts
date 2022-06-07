import { useContext } from 'react';

import { PreferencesContext } from 'providers/preferences-provider';

import type { PreferencesContextInterface } from 'types';

const usePreferences = (): PreferencesContextInterface => {
  const { apiKey, apiRegion, theme, toggleTheme, setClientCredentials } =
    useContext(PreferencesContext);

  return {
    theme,
    apiKey,
    apiRegion,
    toggleTheme,
    setClientCredentials,
  };
};

export default usePreferences;
