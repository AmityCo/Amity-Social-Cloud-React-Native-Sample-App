import React, { FC } from 'react';
import { Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';

import usePreferences from 'hooks/usePreferences';

const App: FC = ({ children }) => {
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

  return <PaperProvider theme={themeObj}>{children}</PaperProvider>;
};

export default App;
