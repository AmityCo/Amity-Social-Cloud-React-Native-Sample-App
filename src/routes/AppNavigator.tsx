import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { Header } from 'components';
import Details from 'screens/Details';

import { t } from 'i18n';

import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      headerMode="screen"
      initialRouteName="ASCApp"
      screenOptions={{
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        ),
      }}
    >
      <Stack.Screen
        name="ASCApp"
        component={BottomTabNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? t('asc');
          return { headerTitle: routeName };
        }}
      />
      <Stack.Screen name="Details" component={Details} options={{ headerTitle: 'Tweet' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
