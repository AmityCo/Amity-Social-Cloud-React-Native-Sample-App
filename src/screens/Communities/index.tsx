/* eslint-disable react/jsx-props-no-spreading */
import { queryCommunities, createQuery, runQuery } from '@amityco/ts-sdk';
import { FlatList, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';

import { Header, CommunityItem, EmptyComponent, FAB, AddCommunity, Loading } from 'components';

import getErrorMessage from 'utils/getErrorMessage';

import { CommunitySortBy, CommunityMembership, DrawerStackHeaderProps, LoadingState } from 'types';

const QUERY_LIMIT = 5;

const CommunitiesScreen: VFC = () => {
  const [isEditId, setIsEditId] = useState('');
  const [showAddCommunity, setShowAddCommunity] = useState(false);
  const [membership] = useState<CommunityMembership>(CommunityMembership.MEMBER);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.NOT_LOADING);
  const [isDeleted, setIsDeleted] = React.useState<Amity.Post['isDeleted']>(false);
  const [sortBy, setSortBy] = React.useState<CommunitySortBy>(CommunitySortBy.LAST_CREATED);

  const [communities, setCommunities] = useState<Record<string, Amity.Community>>({});

  const [{ error, nextPage, loading: queryLoading }, setMetadata] = useState<
    Amity.QueryMetadata & Amity.Pages
  >({
    nextPage: null,
    prevPage: null,
  });

  const flatlistRef = useRef<FlatList<Amity.Community>>(null);

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
        if (reset) setCommunities({});

        setCommunities(prevCommunities => ({ ...prevCommunities, ...data }));

        // @ts-ignore
        setMetadata(metadata);
      });
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

  useEffect(() => {
    if (!queryLoading) {
      setLoading(LoadingState.NOT_LOADING);
    }
  }, [queryLoading]);

  React.useEffect(() => {
    const unsubscribe = navigation?.dangerouslyGetParent()?.addListener('tabPress', e => {
      onRefresh();
      flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    });

    return unsubscribe;
  }, [navigation, onRefresh]);

  const handleLoadMore = () => {
    if (nextPage) {
      setLoading(LoadingState.IS_LOADING_MORE);
      onQueryCommunities({ page: nextPage });
    }
  };

  const data = Object.values(communities);
  const errorText = getErrorMessage(error);
  const visibleAddCommunity = showAddCommunity || isEditId !== '';

  return (
    <Surface style={styles.container}>
      <FlatList
        data={data}
        ref={flatlistRef}
        onRefresh={onRefresh}
        onEndReached={handleLoadMore}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.communityId}
        refreshing={loading === LoadingState.IS_REFRESHING || !!queryLoading}
        ListFooterComponent={
          loading === LoadingState.IS_LOADING_MORE && !!queryLoading ? <Loading /> : undefined
        }
        renderItem={({ item }) => (
          <Surface style={styles.communityItem}>
            <CommunityItem
              community={item}
              onEditCommunity={id => {
                setIsEditId(id);
              }}
              onPress={() => {
                navigation.navigate('Community', { community: item });
              }}
            />
          </Surface>
        )}
        ListEmptyComponent={
          loading === LoadingState.NOT_LOADING && !queryLoading ? (
            <EmptyComponent errorText={error ? errorText : undefined} />
          ) : null
        }
      />

      {visibleAddCommunity && (
        <AddCommunity
          onClose={() => {
            setIsEditId('');
            setShowAddCommunity(false);
          }}
          isEditId={isEditId}
          onAddCommunity={onRefresh}
          visible
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  communityItem: {
    flex: 1,
    margin: 12,
    borderRadius: 5,
  },
});

export default CommunitiesScreen;
