import { connectClient } from '@amityco/ts-sdk';
import { ColorSchemeName } from 'react-native';

type LoginFormData = Parameters<typeof connectClient>[0];

export type PreferencesContextInterface = {
  theme: ColorSchemeName;
  toggleTheme: () => void;
};

export type AuthContextInterface = {
  error: string;
  logout: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  client: Amity.Client;
  login: (data: LoginFormData) => void;
};
