import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { queryCommunities, createQuery, runQuery } from '@amityco/ts-sdk';
import React, { VFC, useState, useLayoutEffect, useRef, useCallback, useEffect } from 'react';

import { Header, CommunityItem, FAB, AddCommunity, Loading, EmptyComponent } from 'components';

import { DrawerStackHeaderProps } from 'types';

import getErrorMessage from 'utils/getErrorMessage';

import styles from './styles';

const QUERY_LIMIT = 10;

const CommunitiesScreen: VFC = () => {
  const [isEditId, setIsEditId] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddCommunity, setShowAddCommunity] = useState(false);
  const [isDeleted] = React.useState<Amity.Community['isDeleted']>(false);
  const [membership] = useState<'member' | 'notMember' | 'all'>('all');
  const [sortBy] = React.useState<'firstCreated' | 'lastCreated' | 'displayName'>('lastCreated');

  const [communities, setCommunities] = useState<Amity.Community[]>([]);

  const [{ error, nextPage, loading }, setMetadata] = useState<Amity.SnapshotOptions & Amity.Pages>(
    {
      nextPage: null,
      prevPage: null,
      error: null,
      loading: false,
      origin: 'local',
    },
  );

  const flatListRef = useRef<FlatList<Amity.Community>>(null);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header scene={scene} previous={previous} navigation={nav} />
      ),
    });
  }, [navigation]);

  const onQueryCommunities = useCallback(
    async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
      const queryData = {
        page,
        sortBy,
        isDeleted,
        membership,
      };

      runQuery(createQuery(queryCommunities, queryData), ({ data, ...metadata }) => {
        if (data) {
          setCommunities(prevCommunities => (reset ? data : [...prevCommunities, ...data]));

          setMetadata(metadata);
        }

        if (!metadata.loading) {
          setIsRefreshing(false);
        }
      });
    },
    [isDeleted, membership, sortBy],
  );

  const onRefresh = useCallback(() => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      onQueryCommunities({ reset: true });
    }
  }, [isRefreshing, onQueryCommunities]);

  useEffect(() => {
    onQueryCommunities({ reset: true });
  }, [onQueryCommunities]);

  React.useEffect(() => {
    const unsubscribe = navigation?.dangerouslyGetParent()?.addListener('tabPress', () => {
      onRefresh();
      flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    });

    return unsubscribe;
  }, [navigation, onRefresh]);

  const handleLoadMore = () => {
    if (nextPage) {
      onQueryCommunities({ page: nextPage });
    }
  };

  const onCloseAddCommunity = useCallback(() => {
    setIsEditId('');
    setShowAddCommunity(false);
  }, []);

  const onEditCommunity = useCallback(id => {
    setIsEditId(id);
  }, []);

  const onPressCommunityItem = useCallback(
    community => {
      navigation.navigate('Community', { community });
    },
    [navigation],
  );

  const errorText = getErrorMessage(error);
  const visibleAddCommunity = showAddCommunity || isEditId !== '';

  return (
    <Surface style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={communities}
        extraData={loading}
        refreshing={isRefreshing}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.communityId}
        ListFooterComponent={loading ? <Loading /> : undefined}
        renderItem={({ item }) => (
          <Surface style={styles.communityItem}>
            <CommunityItem
              community={item}
              onEditCommunity={onEditCommunity}
              onPress={() => onPressCommunityItem(item)}
            />
          </Surface>
        )}
        ListEmptyComponent={
          !loading ? <EmptyComponent errorText={error ? errorText : undefined} /> : null
        }
        onRefresh={onRefresh}
        onEndReached={handleLoadMore}
      />

      {visibleAddCommunity && (
        <AddCommunity
          isEditId={isEditId}
          onAddCommunity={onRefresh}
          onClose={onCloseAddCommunity}
        />
      )}

      <FAB
        icon="plus"
        onPress={() => {
          setShowAddCommunity(true);
        }}
      />
    </Surface>
  );
};

export default CommunitiesScreen;
