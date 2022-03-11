import React, { VFC } from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import FeedScreen from 'screens/Feed';
// import ChatScreen from 'screens/Chat';
import UserScreen from 'screens/User';
import UsersScreen from 'screens/Users';
import CommunityScreen from 'screens/Community';
import CommunitiesScreen from 'screens/Communities';

import { t } from 'i18n';
import overlay from 'utils/overlay';
import { BottomTabParamList } from 'types';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const FeedNavigator: VFC = () => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <Stack.Navigator headerMode="screen" initialRouteName="Feed">
        <Stack.Screen name="Feed" component={FeedScreen} />
      </Stack.Navigator>
    </View>
  );
};

const UsersNavigator: VFC = () => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <Stack.Navigator headerMode="screen" initialRouteName="UserList">
        <Stack.Screen name="Users" component={UsersScreen} />
        <Stack.Screen name="User" component={UserScreen} />
      </Stack.Navigator>
    </View>
  );
};

const CommunitiesNavigator: VFC = () => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <Stack.Navigator headerMode="screen" initialRouteName="Communities">
        <Stack.Screen name="Communities" component={CommunitiesScreen} />
        <Stack.Screen name="Community" component={CommunityScreen} />
      </Stack.Navigator>
    </View>
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
      <Tab.Screen
        name="FeedNavigator"
        component={FeedNavigator}
        options={{
          tabBarIcon: routeName === 'FeedNavigator' ? 'message-text' : 'message-text-outline',
          tabBarColor,
          tabBarLabel: t('routes.feed'),
        }}
      />
      <Tab.Screen
        name="UsersNavigator"
        component={UsersNavigator}
        options={{
          tabBarIcon:
            routeName === 'UsersNavigator' ? 'account-multiple' : 'account-multiple-outline',
          tabBarColor,
          tabBarLabel: t('routes.users'),
        }}
      />
      <Tab.Screen
        name="CommunitiesNavigator"
        component={CommunitiesNavigator}
        options={{
          tabBarIcon:
            routeName === 'CommunitiesNavigator' ? 'account-group' : 'account-group-outline',
          tabBarColor,
          tabBarLabel: t('routes.communities'),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
