import React from 'react';

type PreferencesContextType = {
	theme: 'light' | 'dark';
	toggleTheme: () => void;
};

// eslint-disable-next-line import/prefer-default-export
export const PreferencesContext = React.createContext<PreferencesContextType>({
	theme: 'light',
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	toggleTheme: () => {},
});
