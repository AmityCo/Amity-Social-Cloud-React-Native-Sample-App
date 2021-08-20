/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useDebounce } from 'use-debounce';
import { StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Surface, Appbar, Searchbar } from 'react-native-paper';
import { queryUsers, runQuery, createQuery } from '@amityco/ts-sdk';
import React, { VFC, useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';

import { Header, EmptyComponent, UserItem, AddUser, Loading } from 'components';

import useAuth from 'hooks/useAuth';

import { UserSortBy, UserFilter, LoadingState, DrawerStackHeaderProps } from 'types';

import FilterDialog from './FilterDialog';

const QUERY_LIMIT = 10;

const UserListScreen: VFC = () => {
  const [isEditId, setIsEditId] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [filter] = useState<UserFilter>(UserFilter.ALL);
  const [sortBy, setSortBy] = useState<UserSortBy>(UserSortBy.LAST_CREATED);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.IS_REFRESHING);

  const [users, setUsers] = useState<Record<string, Amity.User>>({});
  const [currentPage, setCurrentPage] = useState<Amity.Page>({ limit: QUERY_LIMIT });

  const [{ error, nextPage }, setMetadata] = useState<Amity.QueryMetadata & Amity.Pages>({
    nextPage: null,
    prevPage: null,
  });

  const [searchText, setSearchText] = useState('');
  const [debouncedDisplayName] = useDebounce(searchText, 1000);

  const flatlistRef = useRef<FlatList<Amity.User>>(null);

  const { client } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header
          scene={scene}
          navigation={nav}
          previous={previous}
          right={<Appbar.Action icon="filter" onPress={() => setShowDialog(true)} />}
        />
      ),
    });
  }, [navigation]);

  const onQueryUsers = useCallback(
    async (reset = false) => {
      const queryData = {
        sortBy,
        filter,
        isDeleted: false,
        page: currentPage,
        targetType: 'user',
        targetId: client.userId,
        displayName: debouncedDisplayName,
      };

      runQuery(createQuery(queryUsers, queryData), ({ data, ...metadata }) => {
        if (reset) setUsers({});

        setUsers(prevUsers => ({ ...prevUsers, ...data }));

        // @ts-ignore
        setMetadata(metadata);

        setLoading(LoadingState.NOT_LOADING);
      });
    },
    [client.userId, currentPage, debouncedDisplayName, filter, sortBy],
  );

  const onRefresh = useCallback(() => {
    setLoading(LoadingState.IS_REFRESHING);
    setCurrentPage({ limit: QUERY_LIMIT });
    onQueryUsers(true);
  }, [onQueryUsers]);

  useEffect(() => {
    onQueryUsers();
  }, [onQueryUsers]);

  useEffect(() => {
    const unsubscribe = navigation?.dangerouslyGetParent()?.addListener('tabPress', e => {
      onRefresh();
      flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    });

    return unsubscribe;
  }, [navigation, onRefresh]);

  const handleLoadMore = () => {
    if (nextPage) {
      setCurrentPage(nextPage);
      setLoading(LoadingState.IS_LOADING_MORE);
    }
  };

  const data = Object.values(users);

  return (
    <Surface style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchText}
        value={searchText}
        style={styles.searchBar}
      />

      <FlatList
        data={data}
        ref={flatlistRef}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        keyExtractor={user => user.userId}
        showsVerticalScrollIndicator={false}
        refreshing={loading === LoadingState.IS_REFRESHING}
        ListFooterComponent={loading === LoadingState.IS_LOADING_MORE ? <Loading /> : undefined}
        // ListEmptyComponent={
        //   loading === LoadingState.NOT_LOADING ? <EmptyComponent errorText={error} /> : null
        // }
        renderItem={({ item }) => (
          <Surface style={styles.userItem}>
            <UserItem
              user={item}
              onEditUser={setIsEditId}
              onPress={() => {
                navigation.navigate('User', { user: item });
              }}
            />
          </Surface>
        )}
      />

      <AddUser
        onClose={() => {
          setIsEditId('');
        }}
        isEditId={isEditId}
        visible={isEditId !== ''}
      />

      <FilterDialog
        sortBy={sortBy}
        setSortBy={setSortBy}
        showDialog={showDialog}
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
