import { ColorSchemeName } from 'react-native-appearance';

import { LoginFormData } from './auth';

export type PreferencesContextInterface = {
	theme: ColorSchemeName;
	toggleTheme: () => void;
};

// TODO fix client
export type AuthContextInterface = {
	error: string;
	logout: () => void;
	isConnected: boolean;
	isAuthenticating: boolean;
	client: Pick<ASC.Client, 'userId'>;
	login: ({ username, password }: LoginFormData) => void;
};
