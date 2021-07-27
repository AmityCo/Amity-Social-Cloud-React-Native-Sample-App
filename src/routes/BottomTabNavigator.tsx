import React, { FC } from 'react';
import color from 'color';
import { useTheme, Portal, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, RouteProp, getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Feed from 'screens/Feed';
import Messages from 'screens/Messages';
import Notifications from 'screens/Notifications';

import overlay from 'utils/overlay';

import { StackNavigatorParamlist } from 'types';

const Tab = createMaterialBottomTabNavigator();

type Props = {
  route: RouteProp<StackNavigatorParamlist, 'FeedList'>;
};

const BottomTabsNavigator: FC<Props> = ({ route }) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  const theme = useTheme();
  const isFocused = useIsFocused();
  const safeArea = useSafeAreaInsets();

  let icon = 'feather';

  switch (routeName) {
    case 'Messages':
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
        initialRouteName="Feed"
        backBehavior="initialRoute"
        shifting
        activeColor={theme.colors.primary}
        inactiveColor={color(theme.colors.text).alpha(0.6).rgb().string()}
        sceneAnimationEnabled={false}
      >
        <Tab.Screen
          name="Feed"
          component={Feed}
          options={{
            tabBarIcon: 'home-account',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{
            tabBarIcon: 'bell-outline',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Messages"
          component={Messages}
          options={{
            tabBarIcon: 'message-text-outline',
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
