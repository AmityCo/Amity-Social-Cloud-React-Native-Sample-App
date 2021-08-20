import { useDebounce } from 'use-debounce';
import { StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Surface, Appbar, Searchbar } from 'react-native-paper';
import { queryUsers, runQuery, createQuery } from '@amityco/ts-sdk';
import React, { VFC, useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';

import { Header, EmptyComponent, UserItem, AddUser, Loading } from 'components';

import useAuth from 'hooks/useAuth';
import getErrorMessage from 'utils/getErrorMessage';

import { UserSortBy, UserFilter, LoadingState, DrawerStackHeaderProps } from 'types';

import FilterDialog from './FilterDialog';

const QUERY_LIMIT = 10;

const UserListScreen: VFC = () => {
  const [isEditId, setIsEditId] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [filter] = useState<UserFilter>(UserFilter.ALL);
  const [sortBy, setSortBy] = useState<UserSortBy>(UserSortBy.LAST_CREATED);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.NOT_LOADING);

  const [users, setUsers] = useState<Record<string, Amity.User>>({});

  const [{ error, nextPage, loading: queryLoading }, setMetadata] = useState<
    Amity.QueryMetadata & Amity.Pages
  >({
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
    async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
      const queryData = {
        page,
        sortBy,
        filter,
        isDeleted: false,
        targetType: 'user',
        targetId: client.userId,
        displayName: debouncedDisplayName,
      };

      runQuery(createQuery(queryUsers, queryData), ({ data, ...metadata }) => {
        if (reset) setUsers({});

        setUsers(prevUsers => ({ ...prevUsers, ...data }));

        // @ts-ignore
        setMetadata(metadata);
      });
    },
    [client.userId, debouncedDisplayName, filter, sortBy],
  );

  const onRefresh = useCallback(() => {
    setLoading(LoadingState.IS_REFRESHING);
    onQueryUsers({ reset: true });
  }, [onQueryUsers]);

  useEffect(() => {
    onQueryUsers({ reset: true });
  }, [onQueryUsers]);

  useEffect(() => {
    if (!queryLoading) {
      setLoading(LoadingState.NOT_LOADING);
    }
  }, [queryLoading]);

  useEffect(() => {
    const unsubscribe = navigation?.dangerouslyGetParent()?.addListener('tabPress', e => {
      onRefresh();
      flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    });

    return unsubscribe;
  }, [navigation, onRefresh]);

  const handleLoadMore = () => {
    if (nextPage) {
      setLoading(LoadingState.IS_LOADING_MORE);
      onQueryUsers({ page: nextPage });
    }
  };

  const data = Object.values(users);
  const errorText = getErrorMessage(error);

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
        refreshing={loading === LoadingState.IS_REFRESHING || !!queryLoading}
        ListFooterComponent={
          loading === LoadingState.IS_LOADING_MORE && !!queryLoading ? <Loading /> : undefined
        }
        ListEmptyComponent={
          loading === LoadingState.NOT_LOADING && !queryLoading ? (
            <EmptyComponent errorText={error ? errorText : undefined} />
          ) : null
        }
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

      {isEditId !== '' && (
        <AddUser
          onClose={() => {
            setIsEditId('');
          }}
          isEditId={isEditId}
          visible
        />
      )}

      {showDialog && (
        <FilterDialog
          sortBy={sortBy}
          setSortBy={setSortBy}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      )}
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
