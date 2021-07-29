import { ColorSchemeName } from 'react-native-appearance';

import { LoginFormData } from './auth';

export type PreferencesContextInterface = {
	theme: ColorSchemeName;
	toggleTheme: () => void;
};

// TODO fix unknown
export type AuthContextInterface = {
	client: unknown;
	isConnected: boolean;
	isAuthenticating: boolean;
	logout: () => void;
	login: ({ username, password }: LoginFormData) => void;
};
