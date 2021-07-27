import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { Header } from 'components';

import Details from 'screens/Details';

import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="FeedList"
      headerMode="screen"
      screenOptions={{
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        ),
      }}
    >
      <Stack.Screen
        name="Feed"
        component={BottomTabNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
          return { headerTitle: routeName };
        }}
      />
      <Stack.Screen name="Details" component={Details} options={{ headerTitle: 'Tweet' }} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
