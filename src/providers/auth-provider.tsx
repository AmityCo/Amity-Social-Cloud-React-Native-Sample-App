/* eslint-disable @typescript-eslint/no-empty-function */
import React, { FC, useState } from 'react';
import {
  createClient,
  connectClient,
  isConnected,
  disconnectClient,
  enableCache,
} from '@amityco/ts-sdk';
// import { useAsync } from 'react-use';

import getErrorMessage from 'utils/getErrorMessage';

import { AuthContextInterface } from 'types';

const client = createClient(
  'b3bee858328ef4344a308e4a5a091688d05fdee2be353a2b',
  'https://api.staging.amity.co/',
);
enableCache();

// eslint-disable-next-line import/prefer-default-export
export const AuthContext = React.createContext<AuthContextInterface>({
  client,
  error: '',
  login: () => {},
  logout: () => {},
  isConnected: false,
  isConnecting: false,
});

// TODO persistant strategy
// TODO error handling
// TODO consider react native offline like  https://github.com/nandorojo/swr-react-native
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

  // useAsync(async () => {
  //   try {
  //     setLoading(true);
  //     await connectClient({ userId, displayName });
  //   } catch (err) {
  //     setError(getErrorMessage(err));
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  const logout = async () => {
    await disconnectClient();
  };

  return (
    <AuthContext.Provider
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
