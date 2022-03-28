import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import UserScreen from 'screens/User';
import PostScreen from 'screens/Post';
import CommentsScreen from 'screens/Comments';
import ChatScreen from 'screens/Chat';

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
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="User" component={UserScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
