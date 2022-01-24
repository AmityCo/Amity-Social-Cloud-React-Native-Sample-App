import React, { FC } from 'react';
import Animated from 'react-native-reanimated';
import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer, Switch, Text, Title, TouchableRipple } from 'react-native-paper';

import usePreferences from 'hooks/usePreferences';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import { alertConfirmation } from 'utils/alerts';

import { DrawerContentProps } from 'types';

import ASCLogo from 'assets/svg/ASCLogo';

import styles from './styles';

const DrawerContent: FC<DrawerContentProps> = props => {
  const { client, logout } = useAuth();
  const { theme, toggleTheme } = usePreferences();

  // eslint-disable-next-line react/destructuring-assignment
  const translateX = Animated.interpolateNode(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  const logOut = () => {
    alertConfirmation(() => {
      const { navigation } = props;
      navigation.toggleDrawer();

      setTimeout(() => {
        logout();
      }, 400);
    });
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <DrawerContentScrollView {...props}>
      <Animated.View
        style={[
          styles.drawerContent,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.userInfoSection}>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              const { navigation } = props;
              navigation.toggleDrawer();
            }}
          >
            <ASCLogo />
          </TouchableOpacity>
          <Title style={styles.title}>@{client.userId}</Title>
        </View>
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={toggleTheme}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={theme === 'dark'} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="logout" color={color} size={size} />
            )}
            label={t('auth.logout')}
            onPress={logOut}
          />
        </Drawer.Section>
      </Animated.View>
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
