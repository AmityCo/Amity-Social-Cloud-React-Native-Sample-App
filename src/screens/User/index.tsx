import { getUser } from '@amityco/ts-sdk';
import { StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, Surface } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import React, { VFC, useLayoutEffect, useState, useEffect } from 'react';

import { Header, UserItem, AddUser } from 'components';

import { t } from 'i18n';
import getErrorMessage from 'utils/getErrorMessage';

import { DrawerStackHeaderProps } from 'types';

import Feed from './Feed';

const UserScreen: VFC = () => {
  const [user, setUser] = useState<Amity.User>();
  const [isEditId, setIsEditId] = useState('');

  const route = useRoute();
  const navigation = useNavigation();

  const {
    user: { userId },
  } = route.params as { user: Amity.User };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user?.displayName ? user?.displayName : 'User',
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.displayName]);

  useEffect(() => {
    getCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const getCurrentUser = async () => {
    try {
      const currentUser = await getUser(userId);

      setUser(currentUser);
    } catch (error) {
      const errorText = getErrorMessage(error);
      Alert.alert(
        'Oooops!',
        errorText,
        [
          {
            text: t('close'),
            onPress: async () => {
              navigation.goBack();
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  return (
    <Surface style={styles.container}>
      {!user?.userId ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <>
          <Feed
            userId={userId}
            header={
              <UserItem
                // eslint-disable-next-line react/jsx-props-no-spreading
                user={user}
                onEditUser={() => {
                  setIsEditId(userId);
                }}
              />
            }
          />

          <AddUser
            onClose={() => {
              setIsEditId('');
            }}
            isEditId={isEditId}
            visible={isEditId !== ''}
          />
        </>
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { marginTop: 20 },
});

export default UserScreen;
