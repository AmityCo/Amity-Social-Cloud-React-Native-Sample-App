import React, { FC } from 'react';
import {
  // Avatar,
  // Caption,
  Drawer,
  // Paragraph,
  Switch,
  Text,
  Title,
  TouchableRipple,
  // useTheme,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import usePreferences from 'hooks/usePreferences';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';

import { DrawerContentProps } from 'types';

import ASCLogo from 'assets/svg/ASCLogo';
// import AvatarHolder from 'assets/images/avatar.png';

const DrawerContent: FC<DrawerContentProps> = props => {
  // const paperTheme = useTheme();
  const { client, logout } = useAuth();
  const { theme, toggleTheme } = usePreferences();

  // eslint-disable-next-line react/destructuring-assignment
  const translateX = Animated.interpolateNode(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  const logOut = () => {
    Alert.alert(
      t('are_you_sure'),
      '',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('ok'),
          onPress: () => {
            props.navigation.toggleDrawer();

            setTimeout(() => {
              logout();
            }, 400);
          },
        },
      ],
      { cancelable: false },
    );
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
              props.navigation.toggleDrawer();
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

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default DrawerContent;
