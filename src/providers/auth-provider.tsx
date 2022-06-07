/* eslint-disable @typescript-eslint/no-empty-function */
import React, { FC, useEffect, useState, useRef } from 'react';
import { Alert } from 'react-native';
import {
  createClient,
  connectClient,
  isConnected,
  disconnectClient,
  enableCache,
} from '@amityco/ts-sdk';

import getErrorMessage from 'utils/getErrorMessage';

import { AuthContextInterface } from 'types';
import usePreferences from 'hooks/usePreferences';

export const AuthContext = React.createContext<AuthContextInterface>({
  error: '',
  login: () => {},
  logout: () => {},
  client: undefined,
  isConnected: false,
  isConnecting: false,
});

export const AuthContextProvider: FC = ({ children }) => {
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [isConnecting, setLoading] = useState(false);

  const client = useRef<Amity.Client>();

  const { apiKey, apiRegion } = usePreferences();

  useEffect(() => {
    if (apiKey !== '' && apiRegion !== '') {
      client.current = createClient(apiKey, apiRegion);
      enableCache();

      setLoaded(true);
    }
  }, [apiKey, apiRegion]);

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

  return loaded ? (
    <AuthContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        error,
        login,
        logout,
        isConnecting,
        client: client.current,
        isConnected: isConnected(),
      }}
    >
      {children}
    </AuthContext.Provider>
  ) : null;
};

export default AuthContext;
