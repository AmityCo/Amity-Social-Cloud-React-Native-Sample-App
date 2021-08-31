import { useContext } from 'react';

import { PreferencesContext } from 'providers/preferences-provider';

import type { PreferencesContextInterface } from 'types';

const usePreferences = (): PreferencesContextInterface => {
  const { theme, toggleTheme } = useContext(PreferencesContext);

  return {
    theme,
    toggleTheme,
  };
};

export default usePreferences;
