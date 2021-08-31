import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from 'screens/Login';

const Stack = createStackNavigator();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      headerMode="screen"
      initialRouteName="ASCAuth"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ASCAuth" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
