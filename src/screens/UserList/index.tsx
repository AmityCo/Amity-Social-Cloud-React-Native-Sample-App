/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { queryUsers } from '@amityco/ts-sdk';
import { FlatList, StyleSheet, View } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import React, { VFC, useState, useLayoutEffect, useEffect } from 'react';
import { Surface, Button, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Header, EmptyComponent } from 'components';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import handleError from 'utils/handleError';

import { PostFeedType, PostFeedTypeeee, PostSortBy } from 'types';

import UserItem from './UserItem';

const UserListScreen: VFC = () => {
  const [error, setError] = useState('');
  const [isEditId, setIsEditId] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<ASC.Post[]>([]);
  const [targetType] = React.useState<ASC.PostTargetType>('user');
  const [feedType] = React.useState<PostFeedType>(PostFeedType.PUBLISHED);
  const [sortBy, setSortBy] = React.useState<PostSortBy>(PostSortBy.LAST_CREATED);
  // const [feedTypeee, setFeedTypeee] = React.useState<PostFeedTypeeee>(PostFeedTypeeee.Normal);

  const { client } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, previous, navigation: nav }: StackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // setPosts([]);

    onQueryUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onQueryUsers = async () => {
    if (!client.userId) {
      setError('UserId is not reachable!');
    }

    setError('');
    setLoading(true);

    try {
      const query = {
        sortBy: 'lastCreated' as 'displayName' | 'firstCreated' | 'lastCreated',
        feedType,
        targetType,
        displayName: '',
        filter: 'all' as 'all' | 'flagged',
        paging: 1,
        targetId: client.userId!,
      };

      const result = await queryUsers(query);

      setUsers(result);
    } catch (e) {
      const errorText = handleError(e);

      setError(errorText);
    } finally {
      setLoading(false);
    }
  };

  const data =
    users?.map(user => ({
      ...user,
      onPress: () => {
        navigation.navigate('User', { ...user, onRefresh: onQueryUsers });
      },
    })) ?? [];

  return (
    <Surface style={styles.container}>
      {error !== '' ? (
        <View>
          <HelperText type="error" style={styles.errorText}>
            {error}
          </HelperText>
          <Button onPress={onQueryUsers}>{t('retry')}</Button>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={post => post.postId}
          renderItem={({ item }) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <UserItem {...item} onRefresh={onQueryUsers} onEditPost={setIsEditId} />
          )}
          ListEmptyComponent={<EmptyComponent loading={loading} errorText={t('posts.no_result')} />}
        />
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  radioArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: { marginBottom: 25 },
  includeDeletedArea: {
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: { fontSize: 18, alignSelf: 'center', marginTop: 25, marginBottom: 15 },
});

export default UserListScreen;
