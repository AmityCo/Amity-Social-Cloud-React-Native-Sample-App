import React, { VFC } from 'react';
import { useTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import FeedScreen from 'screens/Feed';
import PostScreen from 'screens/Post';
// import ChatScreen from 'screens/Chat';
// import UserListScreen from 'screens/UserList';
import CommunitiesScreen from 'screens/Communities';

import overlay from 'utils/overlay';
import { BottomTabParamList } from 'types';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const FeedNavigator: VFC = () => {
  return (
    <Stack.Navigator headerMode="screen" initialRouteName="Feed">
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="Post" component={PostScreen} />
    </Stack.Navigator>
  );
};

// const ChatNavigator: VFC = () => {
//   return (
//     <Stack.Navigator headerMode="screen" initialRouteName="Chat">
//       <Stack.Screen name="Chat" component={ChatScreen} />
//     </Stack.Navigator>
//   );
// };

// const UserListNavigator: VFC = () => {
//   return (
//     <Stack.Navigator headerMode="screen" initialRouteName="UserList">
//       <Stack.Screen name="UserList" component={UserListScreen} />
//     </Stack.Navigator>
//   );
// };

const CommunitiesNavigator: VFC = () => {
  return (
    <Stack.Navigator headerMode="screen" initialRouteName="Communities">
      <Stack.Screen name="Communities" component={CommunitiesScreen} />
    </Stack.Navigator>
  );
};

type Props = {
  route: RouteProp<BottomTabParamList, 'Chat' | 'Feed' | 'UserList' | 'Communities'>;
};

const BottomTabsNavigator: VFC<Props> = ({ route }) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  const theme = useTheme();
  const safeArea = useSafeAreaInsets();

  const tabBarColor = theme.dark
    ? (overlay(6, theme.colors.surface) as string)
    : theme.colors.surface;

  return (
    <Tab.Navigator
      shifting
      initialRouteName="FeedNavigator"
      backBehavior="initialRoute"
      sceneAnimationEnabled={false}
      activeColor={theme.colors.primary}
      safeAreaInsets={{ bottom: safeArea.bottom }}
      inactiveColor={theme.colors.text}
    >
      {/* <Tab.Screen
        name="ChatNavigator"
        component={ChatNavigator}
        options={{
          tabBarIcon: routeName === 'ChatNavigator' ? 'chat' : 'chat-outline',
          tabBarColor,
          tabBarLabel: 'Chat',
        }}
      /> */}
      <Tab.Screen
        name="FeedNavigator"
        component={FeedNavigator}
        options={{
          tabBarIcon: routeName === 'FeedNavigator' ? 'message-text' : 'message-text-outline',
          tabBarColor,
          tabBarLabel: 'Feed',
        }}
      />
      {/* <Tab.Screen
        name="UserListNavigator"
        component={UserListNavigator}
        options={{
          tabBarIcon:
            routeName === 'UserListNavigator' ? 'account-multiple' : 'account-multiple-outline',
          tabBarColor,
          tabBarLabel: 'User List',
        }}
      /> */}
      <Tab.Screen
        name="CommunitiesNavigator"
        component={CommunitiesNavigator}
        options={{
          tabBarIcon:
            routeName === 'CommunitiesNavigator' ? 'account-group' : 'account-group-outline',
          tabBarColor,
          tabBarLabel: 'Communities',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
