import { Pressable, View } from 'react-native';
import React, { FC, ReactElement } from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { StackHeaderProps } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import ASCLogo from 'assets/svg/ASCLogo';

import styles from './styles';

type HeaderProps = {
  drawer?: boolean;
  left?: ReactElement;
  right?: ReactElement;
  navigation: DrawerNavigationProp<Record<string, undefined>>;
};

const Header: FC<Pick<StackHeaderProps, 'previous' | 'scene'> & HeaderProps> = ({
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
          <Appbar.BackAction color={theme.colors.accent} onPress={navigation.goBack} />
        ) : (
          left ||
          (drawer && (
            <Pressable
              style={styles.drawerIcon}
              onPress={() => {
                navigation.openDrawer();
              }}
            >
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

export default Header;
