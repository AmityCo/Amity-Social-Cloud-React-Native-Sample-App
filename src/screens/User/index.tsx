import { ActivityIndicator, Surface } from 'react-native-paper';
import { getUser, createQuery, runQuery } from '@amityco/ts-sdk';
import { useRoute, useNavigation } from '@react-navigation/native';
import React, { VFC, useLayoutEffect, useState, useEffect, useCallback } from 'react';

import { Header, UserItem, UpdateUser, Feed } from 'components';

import { alertError } from 'utils/alerts';

import { DrawerStackHeaderProps } from 'types';

import styles from './styles';

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
      headerTitle: user?.displayName ? user.displayName : 'User',
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
  }, [navigation, user]);

  const getCurrentUser = useCallback(async () => {
    const query = createQuery(getUser, userId);

    runQuery(query, ({ data, error }) => {
      if (data) {
        setUser(data);
      } else if (error) {
        alertError(error, () => {
          navigation.goBack();
        });
      }
    });
  }, [navigation, userId]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser, userId]);

  const onCloseUpdateUser = useCallback(() => {
    setIsEditId('');
  }, []);

  const onEditUser = useCallback(() => {
    setIsEditId(userId);
  }, [userId]);

  return (
    <Surface style={styles.container}>
      {!user?.userId ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <React.Fragment>
          <Feed
            targetId={userId}
            targetType="user"
            header={<UserItem user={user} onEditUser={onEditUser} />}
          />

          {isEditId !== '' && <UpdateUser isEditId={isEditId} onClose={onCloseUpdateUser} />}
        </React.Fragment>
      )}
    </Surface>
  );
};

export default UserScreen;
