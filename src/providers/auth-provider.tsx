/* eslint-disable @typescript-eslint/no-empty-function */
import React, { FC } from 'react';
import {
  createClient,
  connectClient,
  isConnected,
  disconnectClient,
  setCache,
} from '@amityco/ts-sdk';

import handleError from 'utils/handleError';

import { AuthContextInterface, LoginFormData } from 'types';

// TODO put it in env
// TODO put it inside + useRef
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = createClient(
  'b3bee858328ef4344a308e4a5a091688d05fdee2be353a2b',
  'https://api.staging.amity.co/',
);
setCache();

// eslint-disable-next-line import/prefer-default-export
export const AuthContext = React.createContext<AuthContextInterface>({
  login: () => {},
  logout: () => {},
  isConnected: false,
  client: { userId: '' },
  isAuthenticating: false,
  error: '',
});

// TODO persistant strategy
// TODO error handling
// TODO consider react native offline like  https://github.com/nandorojo/swr-react-native
export const AuthContextProvider: FC = ({ children }) => {
  const [error, setError] = React.useState('');
  const [isAuth, setIsAuth] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const checkConnected = () => {
    const isAuthenticated = isConnected();

    setIsAuth(isAuthenticated);
  };

  const login = async (data: LoginFormData) => {
    setError('');
    setLoading(true);

    try {
      await connectClient({ userId: data.username, displayName: undefined });

      checkConnected();
    } catch (e) {
      const errorText = handleError(e);

      setError(errorText);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await disconnectClient();

    checkConnected();
  };

  React.useEffect(() => {
    checkConnected();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        error,
        login,
        client,
        logout,
        isConnected: isAuth,
        isAuthenticating: loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
