import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  runQuery,
  createQuery,
  queryCommunityMembers,
  removeCommunityMembers,
} from '@amityco/ts-sdk';
import React, { VFC, useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';

import { Header, EmptyComponent, UserItem, Loading, FAB, AddCommunityMember } from 'components';

import useAuth from 'hooks/useAuth';
import getErrorMessage from 'utils/getErrorMessage';
import { alertConfirmation, alertError } from 'utils/alerts';

import { DrawerStackHeaderProps } from 'types';

import styles from './styles';

const QUERY_LIMIT = 10;

const CommunityMembersScreen: VFC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [membership] = useState<('member' | 'banned')[]>(['member']);
  const [isDeleted] = React.useState<Amity.Community['isDeleted']>(false);
  const [sortBy] = React.useState<'firstCreated' | 'lastCreated'>('lastCreated');
  const [visibleAddCommunityMember, setVisibleAddCommunityMember] = useState(false);

  const [members, setMembers] = useState<Amity.Membership<'community'>[]>([]);

  const [options, setOptions] = useState<Amity.RunQueryOptions<typeof queryCommunityMembers>>();
  const { error, nextPage, loading } = options ?? {};

  const route = useRoute();
  const { client } = useAuth();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList<Amity.Membership<'community'>>>(null);

  const { communityId, displayName, userId } = route.params as Amity.Community;

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

      runQuery(createQuery(queryCommunityMembers, queryData), ({ data, ...metadata }) => {
        if (data) {
          setMembers(prevMembers => (reset ? data : [...prevMembers, ...data]));
        }

        setOptions(metadata);

        if (!metadata.loading) {
          setIsRefreshing(false);
        }
      });
    },
    [communityId, isDeleted, membership, sortBy],
  );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    onQueryUsers({ reset: true });
  }, [onQueryUsers]);

  useEffect(() => {
    onQueryUsers({ reset: true });
  }, [onQueryUsers]);

  const handleLoadMore = () => {
    if (nextPage) {
      onQueryUsers({ page: nextPage });
    }
  };

  const onPressUserItem = useCallback(
    user => {
      navigation.navigate('User', { user });
    },
    [navigation],
  );

  const onDeleteUser = useCallback(
    userId_ => {
      alertConfirmation(() => {
        runQuery(
          createQuery(removeCommunityMembers, communityId, [userId_]),
          ({ data, error: error_ }) => {
            if (data) {
              onRefresh();
            } else if (error_) {
              alertError(error_);
            }
          },
        );
      });
    },
    [communityId, onRefresh],
  );

  const isOwner = client.userId === userId;
  const errorText = getErrorMessage(error);

  return (
    <Surface style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={members}
        keyExtractor={user => user.userId}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        ListFooterComponent={loading ? <Loading /> : undefined}
        ListEmptyComponent={
          !loading ? <EmptyComponent errorText={error ? errorText : undefined} /> : null
        }
        renderItem={({ item }) => (
          <Surface style={styles.userItem}>
            <UserItem
              user={item}
              canDelete={isOwner}
              onDeleteUser={onDeleteUser}
              onPress={() => onPressUserItem(item)}
            />
          </Surface>
        )}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
      />

      {visibleAddCommunityMember && (
        <AddCommunityMember
          communityId={communityId}
          onAddMember={onRefresh}
          onClose={() => setVisibleAddCommunityMember(false)}
        />
      )}

      {isOwner && (
        <FAB
          icon="plus"
          onPress={() => {
            setVisibleAddCommunityMember(true);
          }}
        />
      )}
    </Surface>
  );
};

export default CommunityMembersScreen;
