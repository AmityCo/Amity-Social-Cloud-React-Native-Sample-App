/* eslint-disable react/jsx-props-no-spreading */
import { queryCommunities, createQuery, runQuery } from '@amityco/ts-sdk';
import { FlatList, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderProps } from '@react-navigation/stack';
import React, { VFC, useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';

import { Header, CommunityItem, EmptyComponent, FAB, AddCommunity, Loading } from 'components';

import handleError from 'utils/handleError';

import { CommunitySortBy, CommunityMembership } from 'types';

const QUERY_LIMIT = 5;

const CommunitiesScreen: VFC = () => {
  const [categoryId] = useState();
  const [error, setError] = useState('');
  const [isEditId, setIsEditId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showAddCommunity, setShowAddCommunity] = useState(false);
  const [membership] = useState<CommunityMembership>(CommunityMembership.MEMBER);
  const [isDeleted, setIsDeleted] = React.useState<Amity.Post['isDeleted']>(false);
  const [sortBy, setSortBy] = React.useState<CommunitySortBy>(CommunitySortBy.LAST_CREATED);

  const [pages, setPages] = useState<Amity.Pages>();
  const [currentPage, setCurrentPage] = useState<Amity.Page>();
  const [communities, setCommunities] = useState<Record<string, Amity.Community>>({});

  const flatlistRef = useRef<FlatList<Amity.Community>>(null);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, previous, navigation: nav }: StackHeaderProps) => (
        <Header scene={scene} previous={previous} navigation={nav} />
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

  // query per page
  useEffect(() => {
    if (currentPage) {
      onQueryCommunities();
    } else {
      onRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, isDeleted]);

  const onQueryCommunities = async () => {
    const queryData = {
      sortBy,
      isDeleted,
      categoryId,
      membership,
    };

    runQuery(createQuery(queryCommunities, { ...queryData, page: currentPage }), result => {
      if (!result.data) return;
      const { data, nextPage, prevPage, loading: loadingStack, error: errorStack } = result;

      if (errorStack) {
        const errorText = handleError(errorStack);

        setError(errorText);
      }

      if (isRefreshing) {
        setCommunities(data);
      } else {
        setCommunities(prevCommunities => ({ ...prevCommunities, ...data }));
      }

      setIsRefreshing(false);
      setIsLoadingMore(false);
      setLoading(!!loadingStack);
      setPages({ nextPage, prevPage });
    });
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

    flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = Object.values(communities);

  return (
    <Surface style={styles.container}>
      <FlatList
        data={data}
        ref={flatlistRef}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        onEndReached={handleLoadMore}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.communityId}
        ListFooterComponent={isLoadingMore ? <Loading /> : undefined}
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
          <EmptyComponent loading={loading} onRetry={onRefresh} errorText={error} />
        }
      />

      <AddCommunity
        onClose={() => {
          setIsEditId('');
          setShowAddCommunity(false);
        }}
        isEditId={isEditId}
        onAddCommunity={onRefresh}
        visible={showAddCommunity || isEditId !== ''}
      />

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
