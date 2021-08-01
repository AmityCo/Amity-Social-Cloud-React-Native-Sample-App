import React, { FC, ReactElement } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { StackHeaderProps } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import ASCLogo from 'assets/svg/ASCLogo';
// import AvatarHolder from 'assets/images/avatar.png';

type HeaderProps = {
  drawer?: boolean;
  left?: ReactElement;
  right?: ReactElement;
};

const Header: FC<Pick<StackHeaderProps, 'navigation' | 'previous' | 'scene'> & HeaderProps> = ({
  left,
  right,
  scene,
  previous,
  navigation,
  drawer = true,
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
      <View style={[styles.column, styles.left]}>
        {previous ? (
          <Appbar.BackAction onPress={navigation.goBack} color={theme.colors.accent} />
        ) : (
          left ||
          (drawer && (
            <Pressable
              style={styles.drawerIcon}
              onPress={() => {
                // eslint-disable-next-line @typescript-eslint/ban-types
                (navigation as unknown as DrawerNavigationProp<{}>).openDrawer();
              }}
            >
              {/* <Avatar.Image size={40} source={AvatarHolder} /> */}
              <ASCLogo width={70} height={45} />
            </Pressable>
          ))
        )}
      </View>
      <Appbar.Content style={[styles.column, styles.center]} title={title} />
      <View style={[styles.column, styles.right]}>{right}</View>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  column: {
    flex: 1,
  },
  left: { alignItems: 'flex-start' },
  center: { alignItems: 'center' },
  right: { alignItems: 'flex-end' },
  drawerIcon: { marginTop: 10 },
});

export default Header;
