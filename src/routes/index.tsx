/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { useTheme } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { DrawerContent } from 'components';

import useAuth from 'hooks/useAuth';

import { DrawerContentProps } from 'types';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import LinkingConfiguration from './LinkingConfiguration';

const Drawer = createDrawerNavigator();

const RootNavigator: React.FC = () => {
  const theme = useTheme();
  const { isConnected, client } = useAuth();

  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme} linking={LinkingConfiguration}>
      {client.userId && isConnected ? (
        <Drawer.Navigator
          drawerContent={(props: DrawerContentProps) => <DrawerContent {...props} />}
        >
          <Drawer.Screen name="ASC" component={AppNavigator} />
        </Drawer.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
