import React from 'react';
import { ColorSchemeName } from 'react-native-appearance';

type PreferencesContextType = {
	theme: ColorSchemeName;
	toggleTheme: () => void;
};

// eslint-disable-next-line import/prefer-default-export
export const PreferencesContext = React.createContext<PreferencesContextType>({
	theme: 'light',
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	toggleTheme: () => {},
});
