import React, { FC } from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {
  Avatar,
  Caption,
  Drawer,
  Paragraph,
  Switch,
  Text,
  Title,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import usePreferences from 'hooks/usePreferences';

import { DrawerContentProps } from 'types';

import { t } from 'i18n';

import AvatarHolder from 'assets/images/avatar.png';

const DrawerContent: FC<DrawerContentProps> = props => {
  const paperTheme = useTheme();
  const { theme, toggleTheme } = usePreferences();

  // eslint-disable-next-line react/destructuring-assignment
  const translateX = Animated.interpolateNode(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <DrawerContentScrollView {...props}>
      <Animated.View
        style={[
          styles.drawerContent,
          {
            backgroundColor: paperTheme.colors.surface,
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
            <Avatar.Image source={AvatarHolder} size={50} />
          </TouchableOpacity>
          <Title style={styles.title}>Dawid Urbaniak</Title>
          <Caption style={styles.caption}>@trensik</Caption>
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>202</Paragraph>
              <Caption style={styles.caption}>Obserwuje</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>159</Paragraph>
              <Caption style={styles.caption}>Obserwujący</Caption>
            </View>
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="account-outline" color={color} size={size} />
            )}
            label={t('profile')}
            onPress={() => {
              //
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="tune" color={color} size={size} />
            )}
            label="Notifications"
            onPress={() => {
              //
            }}
          />
        </Drawer.Section>
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
