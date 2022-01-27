import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { queryCommunities, createQuery, runQuery, sortByLastCreated } from '@amityco/ts-sdk';
import React, { VFC, useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';

import { Header, CommunityItem, EmptyComponent, FAB, AddCommunity, Loading } from 'components';

import getErrorMessage from 'utils/getErrorMessage';

import { DrawerStackHeaderProps, LoadingState } from 'types';

import styles from './styles';

const QUERY_LIMIT = 5;

const CommunitiesScreen: VFC = () => {
  const [isEditId, setIsEditId] = useState('');
  const [showAddCommunity, setShowAddCommunity] = useState(false);
  const [isDeleted] = React.useState<Amity.Community['isDeleted']>(false);
  const [membership] = useState<'member' | 'notMember' | 'all'>('member');
  const [loading, setLoading] = useState<LoadingState>(LoadingState.NOT_LOADING);
  const [sortBy] = React.useState<'firstCreated' | 'lastCreated' | 'displayName'>('lastCreated');

  const [communities, setCommunities] = useState<Record<string, Amity.Community>>({});

  const [{ error, nextPage }, setMetadata] = useState<Amity.QueryMetadata & Amity.Pages>({
    nextPage: null,
    prevPage: null,
  });

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

      runQuery(
        createQuery(queryCommunities, queryData),
        ({ data, loading: loading_, ...metadata }) => {
          if (reset) setCommunities({});

          if (data) {
            setCommunities(prevCommunities => ({ ...prevCommunities, ...data }));

            // @ts-ignore
            setMetadata(metadata);
          }

          if (!loading_) {
            setLoading(LoadingState.NOT_LOADING);
          }
        },
      );
    },
    [isDeleted, membership, sortBy],
  );

  const onRefresh = useCallback(() => {
    setLoading(LoadingState.IS_REFRESHING);
    onQueryCommunities({ reset: true });
  }, [onQueryCommunities]);

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
      setLoading(LoadingState.IS_LOADING_MORE);
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
  const data = Object.values(communities)
    .filter(post => (!isDeleted ? !post.isDeleted : true))
    .sort(sortByLastCreated);
  const visibleAddCommunity = showAddCommunity || isEditId !== '';

  return (
    <Surface style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.communityId}
        refreshing={loading === LoadingState.IS_REFRESHING}
        ListFooterComponent={loading === LoadingState.IS_LOADING_MORE ? <Loading /> : undefined}
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
          loading === LoadingState.NOT_LOADING ? (
            <EmptyComponent errorText={error ? errorText : undefined} />
          ) : null
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
