import React, { FC } from 'react';
import color from 'color';
import { Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import {
  TabBar,
  TabView,
  SceneMap,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';

// import Feed from 'screens/Feed';
import overlay from 'utils/overlay';
import AllNotifications from './Notifications';

const initialLayout = { width: Dimensions.get('window').width };

// const All = () => <AllNotifications />;

// const Mentions = () => <Feed />;

type State = NavigationState<{
  key: string;
  title: string;
}>;

const UserListScreen: FC = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'all', title: 'All' },
    { key: 'mentions', title: 'Mentions' },
  ]);

  const theme = useTheme();

  // const renderScene = SceneMap({
  //   all: All,
  //   mentions: Mentions,
  // });

  const tabBarColor = theme.dark
    ? (overlay(4, theme.colors.surface) as string)
    : theme.colors.surface;

  const rippleColor = theme.dark
    ? color(tabBarColor).lighten(0.5).toString()
    : color(tabBarColor).darken(0.2).toString();

  // const renderTabBar = (props: SceneRendererProps & { navigationState: State }) => (
  //   <TabBar
  //     // eslint-disable-next-line react/jsx-props-no-spreading
  //     {...props}
  //     // indicatorStyle={{ backgroundColor: theme.colors.primary }}
  //     style={{
  //       // backgroundColor: theme.colors.backdrop,
  //       shadowColor: theme.colors.text,
  //     }}
  //     pressColor={rippleColor}
  //   />
  // );

  return <AllNotifications />;
};
// <>
//   <TabView
//     navigationState={{ index, routes }}
//     renderScene={renderScene}
//     onIndexChange={setIndex}
//     initialLayout={initialLayout}
//     renderTabBar={renderTabBar}
//   />
// </>

export default UserListScreen;
