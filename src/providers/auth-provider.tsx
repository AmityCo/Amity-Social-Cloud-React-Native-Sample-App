/* eslint-disable @typescript-eslint/no-empty-function */
import React, { FC, useState } from 'react';
import { Alert } from 'react-native';
import {
  createClient,
  connectClient,
  isConnected,
  disconnectClient,
  enableCache,
} from '@amityco/ts-sdk';
import Constants from 'expo-constants';

import getErrorMessage from 'utils/getErrorMessage';

import { AuthContextInterface } from 'types';

const client = createClient(Constants.manifest?.extra?.apiKey || '', 'staging');
enableCache();

export const AuthContext = React.createContext<AuthContextInterface>({
  client,
  error: '',
  login: () => {},
  logout: () => {},
  isConnected: false,
  isConnecting: false,
});

export const AuthContextProvider: FC = ({ children }) => {
  const [error, setError] = useState('');
  const [isConnecting, setLoading] = useState(false);

  const login = async ({ userId, displayName }: Parameters<typeof connectClient>[0]) => {
    setError('');
    setLoading(true);

    try {
      await connectClient({ userId, displayName });
    } catch (e) {
      const errorText = getErrorMessage(e);

      setError(errorText);
    } finally {
      setLoading(false);
    }
  };

  // TODO
  const logout = async () => {
    try {
      await disconnectClient();
    } catch (e) {
      const errorText = getErrorMessage(e);

      Alert.alert(errorText);
    }

    // Updates.reloadAsync();
  };

  return (
    <AuthContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        error,
        login,
        client,
        logout,
        isConnecting,
        isConnected: isConnected(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
