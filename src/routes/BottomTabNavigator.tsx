import color from 'color';
import React, { FC } from 'react';
import { useTheme, Portal, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useIsFocused, RouteProp, getFocusedRouteNameFromRoute } from '@react-navigation/native';

import FeedScreen from 'screens/Feed';
import ChatScreen from 'screens/Chat';
import UserListScreen from 'screens/UserList';
import CommunitiesScreen from 'screens/Communities';

import overlay from 'utils/overlay';
import { StackNavigatorParamlist } from 'types';

const Tab = createMaterialBottomTabNavigator();

type Props = {
  route: RouteProp<StackNavigatorParamlist, 'FeedList'>;
};

const BottomTabsNavigator: FC<Props> = ({ route }) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Chat';

  const theme = useTheme();
  const isFocused = useIsFocused();
  const safeArea = useSafeAreaInsets();

  let icon = 'feather';

  switch (routeName) {
    case 'Chat':
      icon = 'email-plus-outline';
      break;
    default:
      icon = 'feather';
      break;
  }

  const tabBarColor = theme.dark
    ? (overlay(6, theme.colors.surface) as string)
    : theme.colors.surface;

  return (
    <>
      <Tab.Navigator
        shifting
        initialRouteName="Chat"
        backBehavior="initialRoute"
        sceneAnimationEnabled={false}
        activeColor={theme.colors.primary}
        safeAreaInsets={{ bottom: safeArea.bottom }}
        inactiveColor={color(theme.colors.text).alpha(0.6).rgb().string()}
      >
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarIcon: routeName === 'Chat' ? 'chat' : 'chat-outline',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarIcon: routeName === 'Feed' ? 'message-text' : 'message-text-outline',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="UserList"
          component={UserListScreen}
          options={{
            tabBarIcon: routeName === 'UserList' ? 'account-multiple' : 'account-multiple-outline',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Communities"
          component={CommunitiesScreen}
          options={{
            tabBarIcon: routeName === 'Communities' ? 'account-group' : 'account-group-outline',
            tabBarColor,
          }}
        />
      </Tab.Navigator>
      <Portal>
        <FAB
          visible={isFocused}
          icon={icon}
          style={{
            position: 'absolute',
            bottom: safeArea.bottom + 65,
            right: 16,
          }}
          color="white"
          theme={{
            colors: {
              accent: theme.colors.primary,
            },
          }}
          // onPress={() => {}}
        />
      </Portal>
    </>
  );
};

export default BottomTabsNavigator;
