import React, { VFC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import FeedScreen from 'screens/Feed';

const Stack = createStackNavigator();

const AppNavigator: VFC = () => {
  return (
    <Stack.Navigator headerMode="screen" initialRouteName="Feed">
      <Stack.Screen name="Feed" component={FeedScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
