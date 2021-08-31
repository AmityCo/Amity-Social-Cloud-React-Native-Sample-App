import { StackHeaderProps } from '@react-navigation/stack';
import {
  DrawerNavigationProp,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer';

export type RootStackParamList = {
  Root: undefined;
};

export type DrawerContentProps = DrawerContentComponentProps<DrawerContentOptions>;

export type DrawerStackHeaderProps = StackHeaderProps & {
  navigation: DrawerNavigationProp<Record<string, undefined>>;
};

export type BottomTabParamList = {
  Chat: undefined;
  Feed: undefined;
  UserList: undefined;
  Communities: undefined;
};
