/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { DrawerContent } from 'components';

import { DrawerContentProps } from 'types';

import StackNavigator from './StackNavigator';
import LinkingConfiguration from './LinkingConfiguration';

const Drawer = createDrawerNavigator();

const RootNavigator: React.FC = () => {
  const theme = useTheme();
  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme} linking={LinkingConfiguration}>
      <Drawer.Navigator drawerContent={(props: DrawerContentProps) => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={StackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
