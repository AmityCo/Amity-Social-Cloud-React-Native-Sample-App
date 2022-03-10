import { FlatList } from 'react-native';
import { useDebounce } from 'use-debounce';
import { useNavigation } from '@react-navigation/native';
import { Surface } from 'react-native-paper';
import { queryUsers, runQuery, createQuery, sortByLastCreated } from '@amityco/ts-sdk';
import React, { VFC, useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';

import { Header, EmptyComponent, UserItem, UpdateUser, Loading } from 'components';

import useAuth from 'hooks/useAuth';
import getErrorMessage from 'utils/getErrorMessage';

import { LoadingState, DrawerStackHeaderProps } from 'types';

import styles from './styles';

const QUERY_LIMIT = 10;

const UserListScreen: VFC = () => {
  const [isEditId, setIsEditId] = useState('');
  const [filter] = useState<'all' | 'flagged'>('all');
  const [loading, setLoading] = useState<LoadingState>(LoadingState.NOT_LOADING);
  const [sortBy] = useState<'displayName' | 'lastCreated' | 'firstCreated'>('lastCreated');

  // const [{ data: users }, setData] = useState<Amity.Snapshot<Amity.User>>({});
  const [users, setUsers] = useState<Amity.User[]>([]);

  const [{ error, nextPage }, setMetadata] = useState<Amity.SnapshotOptions & Amity.Pages>({
    nextPage: null,
    prevPage: null,
    loading: false,
    origin: 'local',
  });

  const [searchText] = useState('Fifa'); // , setSearchText
  const [debouncedDisplayName] = useDebounce(searchText, 1000);

  const flatListRef = useRef<FlatList<Amity.User>>(null);

  const { client } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
  }, [navigation]);

  const onQueryUsers = useCallback(
    async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
      const queryData = {
        page,
        filter,
        sortBy,
        targetType: 'user',
        targetId: client.userId,
        displayName: debouncedDisplayName,
      };

      // let uniqueObjArray = [...new Map(objArray.map((item) => [item["id"], item])).values()];
      runQuery(createQuery(queryUsers, queryData), ({ data, ...metadata }) => {
        if (data) {
          setUsers(prevUsers => (reset ? data : [...prevUsers, ...data]));
        }
        // console.log({ data, metadata });
        setMetadata({ ...metadata });

        if (metadata?.loading === false) {
          setLoading(LoadingState.NOT_LOADING);
        }
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
    const unsubscribe = navigation?.getParent()?.addListener('tabPress', () => {
      onRefresh();
      flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    });

    return unsubscribe;
  }, [navigation, onRefresh]);

  const handleLoadMore = () => {
    if (nextPage) {
      setLoading(LoadingState.IS_LOADING_MORE);
      onQueryUsers({ page: nextPage });
    }
  };

  const onCloseUpdateUser = useCallback(() => {
    setIsEditId('');
  }, []);

  const onPressUserItem = useCallback(
    user => {
      navigation.navigate('User', { user });
    },
    [navigation],
  );

  const errorText = getErrorMessage(error);
  const data = users.sort(sortByLastCreated);

  // console.log({ users, data });

  return (
    <Surface style={styles.container}>
      {/* <SearchBar
        placeholder="Search"
        value={searchText}
        style={styles.searchBar}
      /> */}

      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={user => user.userId}
        showsVerticalScrollIndicator={false}
        refreshing={loading === LoadingState.IS_REFRESHING}
        ListFooterComponent={loading === LoadingState.IS_LOADING_MORE ? <Loading /> : undefined}
        ListEmptyComponent={
          loading === LoadingState.NOT_LOADING ? (
            <EmptyComponent errorText={error ? errorText : undefined} />
          ) : null
        }
        renderItem={({ item }) => (
          <Surface style={styles.userItem}>
            <UserItem user={item} onEditUser={setIsEditId} onPress={() => onPressUserItem(item)} />
          </Surface>
        )}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
      />

      {isEditId !== '' && <UpdateUser isEditId={isEditId} onClose={onCloseUpdateUser} />}
    </Surface>
  );
};

export default UserListScreen;
