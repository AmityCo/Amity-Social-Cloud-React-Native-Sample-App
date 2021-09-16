import { View } from 'react-native';
import { Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React, { VFC, useLayoutEffect } from 'react';

import { Header } from 'components';

import { DrawerStackHeaderProps } from 'types';

import styles from './styles';

const ChatScreen: VFC = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
  }, [navigation]);

  return (
    <Surface style={styles.container}>
      <View />
    </Surface>
  );
};

export default ChatScreen;
