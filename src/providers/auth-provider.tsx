/* eslint-disable @typescript-eslint/no-empty-function */
import React, { FC } from 'react';
import { createClient, connectClient, isConnected, disconnectClient } from '@amityco/ts-sdk';

import { AuthContextInterface, LoginFormData } from 'types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = createClient('b3bee90c39d9a5644831d84e5a0d1688d100ddebef3c6e78');

// eslint-disable-next-line import/prefer-default-export
export const AuthContext = React.createContext<AuthContextInterface>({
  client: {},
  login: () => {},
  logout: () => {},
  isConnected: false,
  isAuthenticating: false,
});

// TODO authenticating
// TODO error handling
export const AuthContextProvider: FC = ({ children }) => {
  const [isAuth, setIsAuth] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const checkConnected = () => {
    const isAuthenticated = isConnected();

    setIsAuth(isAuthenticated);
  };

  const login = async (data: LoginFormData) => {
    setLoading(true);

    try {
      await connectClient(data.username);

      checkConnected();
    } catch (error) {
      // console.log('error', error);
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
