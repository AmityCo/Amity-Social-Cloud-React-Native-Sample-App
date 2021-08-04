import { useContext } from 'react';

import { AuthContext } from 'providers/auth-provider';

import type { AuthContextInterface } from 'types';

const useAuth = (): AuthContextInterface => {
	const { login, logout, client, isConnected, isAuthenticating, error } = useContext(AuthContext);

	return {
		error,
		login,
		client,
		logout,
		isConnected,
		isAuthenticating,
	};
};

export default useAuth;
