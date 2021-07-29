import * as React from 'react';
import { Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';

import usePreferences from 'hooks/usePreferences';
import RootNavigator from './RootNavigator';

const Navigation: React.FC = () => {
  const { theme } = usePreferences();

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
    <PaperProvider theme={themeObj}>
      <RootNavigator />
    </PaperProvider>
  );
};

export default Navigation;
