import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';
import { runQuery, createQuery, sortByLastCreated, queryCommunityMembers } from '@amityco/ts-sdk';

import { Header, EmptyComponent, UserItem, Loading } from 'components';

import getErrorMessage from 'utils/getErrorMessage';

import { LoadingState, DrawerStackHeaderProps } from 'types';

import styles from './styles';

const QUERY_LIMIT = 10;

const CommunityMembersScreen: VFC = () => {
  const [membership] = useState<('member' | 'banned')[]>(['member']);
  const [isDeleted] = React.useState<Amity.Community['isDeleted']>(false);
  const [sortBy] = React.useState<'firstCreated' | 'lastCreated'>('lastCreated');
  const [loading, setLoading] = useState<LoadingState>(LoadingState.NOT_LOADING);

  const [members, setMembers] = useState<Record<string, Amity.Membership<'community'>>>({});

  const [{ error, nextPage }, setMetaData] = useState<
    Amity.QueryResult<Amity.Paged<Amity.Community>>
  >({ nextPage: null, prevPage: null });

  const route = useRoute();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList<Amity.Membership<'community'>>>(null);

  const { communityId, displayName } = route.params as Amity.Community;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: displayName,
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
  }, [displayName, navigation]);

  const onQueryUsers = useCallback(
    async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
      const queryData = {
        page,
        communityId,
        sortBy,
        isDeleted,
        membership,
      };

      runQuery(
        createQuery(queryCommunityMembers, queryData),
        ({ data, loading: loading_, ...metadata }) => {
          if (reset) setMembers({});

          if (data) {
            setMembers(prevUsers => ({ ...prevUsers, ...data }));
          }

          // @ts-ignore
          setMetaData(metadata);

          if (!loading_) {
            setLoading(LoadingState.NOT_LOADING);
          }
        },
      );
    },
    [communityId, isDeleted, membership, sortBy],
  );

  const onRefresh = useCallback(() => {
    setLoading(LoadingState.IS_REFRESHING);
    onQueryUsers({ reset: true });
  }, [onQueryUsers]);

  useEffect(() => {
    onQueryUsers({ reset: true });
  }, [onQueryUsers]);

  const handleLoadMore = () => {
    if (nextPage) {
      setLoading(LoadingState.IS_LOADING_MORE);
      onQueryUsers({ page: nextPage });
    }
  };

  const onPressUserItem = useCallback(
    user => {
      navigation.navigate('User', { user });
    },
    [navigation],
  );

  const errorText = getErrorMessage(error);
  const data = Object.values(members).sort(sortByLastCreated);

  return (
    <Surface style={styles.container}>
      <FlatList
        data={data}
        ref={flatListRef}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
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
            <UserItem user={item} onPress={() => onPressUserItem(item)} />
          </Surface>
        )}
      />
    </Surface>
  );
};

export default CommunityMembersScreen;
