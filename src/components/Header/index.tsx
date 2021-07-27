import * as React from 'react';
import { Pressable } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import { Appbar, Avatar, useTheme } from 'react-native-paper';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import ASCLogo from 'assets/svg/ASCLogo';
// eslint-disable-next-line import/extensions
import AvatarHolder from 'assets/images/avatar.png';

const Header: React.FC<Pick<StackHeaderProps, 'navigation' | 'previous' | 'scene'>> = ({
  scene,
  previous,
  navigation,
}) => {
  const theme = useTheme();
  const { options } = scene.descriptor;
  const title =
    // eslint-disable-next-line no-nested-ternary
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  return (
    <Appbar.Header theme={{ colors: { primary: theme.colors.surface } }}>
      {previous ? (
        <Appbar.BackAction onPress={navigation.goBack} color={theme.colors.primary} />
      ) : (
        <Pressable
          onPress={() => {
            // eslint-disable-next-line @typescript-eslint/ban-types
            (navigation as unknown as DrawerNavigationProp<{}>).openDrawer();
          }}
        >
          <Avatar.Image size={40} source={AvatarHolder} />
        </Pressable>
      )}
      <Appbar.Content title={previous ? title : <ASCLogo />} />
    </Appbar.Header>
  );
};

export default Header;
