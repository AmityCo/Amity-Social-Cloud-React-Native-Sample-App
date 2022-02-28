import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PostScreen from 'screens/Post';
import CommentsScreen from 'screens/Comments';

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
      <Stack.Screen name="Post" component={PostScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
