/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderProps } from '@react-navigation/stack';
import { Surface, Appbar, Searchbar } from 'react-native-paper';
import { queryUsers, runQuery, createQuery } from '@amityco/ts-sdk';
import React, { VFC, useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';

import { Header, EmptyComponent, UserItem, AddUser, Loading } from 'components';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import useDebounce from 'hooks/useDebounce';
import handleError from 'utils/handleError';

import { UserSortBy, UserFilter, UserItemProps } from 'types';

import FilterDialog from './FilterDialog';

const QUERY_LIMIT = 10;

const UserListScreen: VFC = () => {
  const [error, setError] = useState('');
  const [isEditId, setIsEditId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [filter] = useState<UserFilter>(UserFilter.ALL);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<UserSortBy>(UserSortBy.LAST_CREATED);

  const [pages, setPages] = useState<Amity.Pages>();
  const [currentPage, setCurrentPage] = useState<Amity.Page>();
  const [users, setUsers] = useState<Record<string, Amity.User>>({});

  const flatlistRef = useRef<FlatList<Amity.User>>(null);

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

  React.useEffect(() => {
    const unsubscribe = navigation?.dangerouslyGetParent()?.addListener('tabPress', e => {
      onRefresh();
      flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  useEffect(() => {
    setDisplayName(searchText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  useEffect(() => {
    if (currentPage) {
      onQueryUsers();
      setLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    onRefresh();
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
      const queryData = {
        sortBy,
        filter,
        displayName,
        isDeleted: false,
        targetType: 'user',
        paging: { limit: 10 },
        targetId: client.userId!,
      };

      runQuery(createQuery(queryUsers, { ...queryData, page: currentPage }), result => {
        if (!result.data) return;
        const { data, nextPage, prevPage, loading: loadingStack, error: errorStack } = result;

        if (errorStack) {
          const errorText = handleError(errorStack);

          setError(errorText);
        }

        if (isRefreshing) {
          setUsers(data);
        } else {
          setUsers(prevUsers => ({ ...prevUsers, ...data }));
        }

        setIsRefreshing(false);
        setIsLoadingMore(false);
        setLoading(!!loadingStack);
        setPages({ nextPage, prevPage });
      });
    } catch (e) {
      const errorText = handleError(e);

      setError(errorText);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (pages?.nextPage) {
      setIsLoadingMore(true);
      setCurrentPage(pages.nextPage);
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setCurrentPage({ before: 0, limit: QUERY_LIMIT });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        refreshing={isRefreshing}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        keyExtractor={user => user.userId}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={isLoadingMore ? <Loading /> : undefined}
        ListEmptyComponent={<EmptyComponent loading={loading || isRefreshing} errorText={error} />}
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
