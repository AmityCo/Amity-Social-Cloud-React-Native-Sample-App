import { connectClient } from '@amityco/ts-sdk';
import { ColorSchemeName } from 'react-native-appearance';

type LoginFormData = Parameters<typeof connectClient>[0];

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
	client: Pick<Amity.Client, 'userId'>;
	login: (data: LoginFormData) => void;
};
