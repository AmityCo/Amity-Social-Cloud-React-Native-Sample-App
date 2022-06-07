import { connectClient } from '@amityco/ts-sdk';
import { ColorSchemeName } from 'react-native';

type LoginFormData = Parameters<typeof connectClient>[0];

export type PreferencesContextInterface = {
  apiKey: string;
  apiRegion: string;
  theme: ColorSchemeName;
  toggleTheme: () => void;
  setClientCredentials: (apiKey: string, apiRegion: string) => void;
};

export type AuthContextInterface = {
  error: string;
  logout: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  client?: Amity.Client;
  login: (data: LoginFormData) => void;
};
