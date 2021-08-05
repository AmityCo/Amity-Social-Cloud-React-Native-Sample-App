/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { queryUsers } from '@amityco/ts-sdk';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderProps } from '@react-navigation/stack';
import { StyleSheet, View, Animated } from 'react-native';
import React, { VFC, useState, useLayoutEffect, useEffect } from 'react';
import { Surface, Appbar, HelperText, Button, Searchbar } from 'react-native-paper';

import { Header, EmptyComponent, UserItem, AddUser } from 'components';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import useDebounce from 'hooks/useDebounce';
import handleError from 'utils/handleError';

import { UserSortBy, UserFilter } from 'types';

import FilterDialog from './FilterDialog';

const UserListScreen: VFC = () => {
  const [error, setError] = useState('');
  const [isEditId, setIsEditId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<ASC.User[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [filter] = useState<UserFilter>(UserFilter.ALL);
  const [sortBy, setSortBy] = useState<UserSortBy>(UserSortBy.LAST_CREATED);

  const { client } = useAuth();
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useDebounce('', 1000);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, previous, navigation: nav }: StackHeaderProps) => (
        <Header
          scene={scene}
          navigation={nav}
          previous={previous}
          right={<Appbar.Action icon="filter" onPress={() => setShowDialog(true)} />}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDisplayName(searchText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  useEffect(() => {
    setUsers([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayName]);

  useEffect(() => {
    onQueryUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, displayName]);

  const onQueryUsers = async () => {
    if (!client.userId) {
      setError('UserId is not reachable!');
    }

    if (loading) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const query = {
        sortBy,
        filter,
        displayName,
        isDeleted: false,
        targetType: 'user',
        paging: { limit: 10 },
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
    users.length > 0
      ? users.map(user => ({
          ...user,
          onPress: () => {
            navigation.navigate('User', { ...user, onRefresh: onQueryUsers });
          },
        }))
      : [];

  return (
    <Surface style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchText}
        value={searchText}
        style={styles.searchBar}
      />

      {error !== '' ? (
        <View>
          <HelperText type="error" style={styles.errorText}>
            {error}
          </HelperText>
          <Button onPress={onQueryUsers}>{t('retry')}</Button>
        </View>
      ) : (
        <Animated.FlatList
          data={data}
          keyExtractor={user => user.userId}
          renderItem={({ item }) => (
            <Surface style={styles.userItem}>
              <UserItem {...item} onEditUser={setIsEditId} onRefresh={onQueryUsers} />
            </Surface>
          )}
          ListEmptyComponent={<EmptyComponent loading={loading} errorText={t('no_result')} />}
        />
      )}

      <AddUser
        onClose={() => {
          setIsEditId('');
        }}
        isEditId={isEditId}
        onAddUser={onQueryUsers}
        visible={isEditId !== ''}
      />

      <FilterDialog
        sortBy={sortBy}
        // filter={filter}
        setSortBy={setSortBy}
        showDialog={showDialog}
        // setFilter={setFilter}
        setShowDialog={setShowDialog}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userItem: {
    flex: 1,
    margin: 12,
    borderRadius: 5,
  },
  searchBar: { height: 60 },
  errorText: { fontSize: 18, alignSelf: 'center', marginTop: 25, marginBottom: 15 },
});

export default UserListScreen;
