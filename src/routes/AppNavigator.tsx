import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Details from 'screens/Details';
import Community from 'screens/Communities/Community';

import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      headerMode="screen"
      initialRouteName="ASCApp"
      screenOptions={{
        header: () => false,
      }}
    >
      <Stack.Screen name="ASCApp" component={BottomTabNavigator} />
      <Stack.Screen name="Details" component={Details} options={{ headerTitle: 'Tweet' }} />
      <Stack.Screen name="Community" component={Community} options={{ headerTitle: 'Community' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
