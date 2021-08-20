/* eslint-disable react/jsx-props-no-spreading */
import { Surface } from 'react-native-paper';
import { StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useEffect, useRef, useCallback, ReactElement } from 'react';
import { queryPosts, createQuery, runQuery, observePosts, queryGlobalFeed } from '@amityco/ts-sdk';

import { EmptyComponent, PostItem, Loading } from 'components';

import getErrorMessage from 'utils/getErrorMessage';

import { LoadingState, PostSortBy, PostFeedType, FeedType } from 'types';

const QUERY_LIMIT = 10;

type FeedComponentType = {
  targetId?: string;
  targetType?: string;
  sortBy?: PostSortBy;
  isDeleted?: boolean;
  feedType?: FeedType;
  postFeedType?: PostFeedType;
  header?: ReactElement;
};

const FeedComponent: VFC<FeedComponentType> = ({
  header,
  targetId,
  targetType,
  isDeleted = false,
  feedType = FeedType.Normal,
  sortBy = PostSortBy.LAST_CREATED,
  postFeedType = PostFeedType.PUBLISHED,
}) => {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.NOT_LOADING);

  const [posts, setPosts] = useState<Record<string, Amity.Post>>({});

  const [{ error, nextPage, loading: queryLoading }, setMetadata] = useState<
    Amity.QueryMetadata & Amity.Pages
  >({
    nextPage: null,
    prevPage: null,
  });

  const flatlistRef = useRef<FlatList<Amity.Post>>(null);

  const navigation = useNavigation();

  const onQueryPost = useCallback(
    async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
      let query = createQuery(queryGlobalFeed, { page });

      if (feedType === FeedType.Normal) {
        const queryData = {
          page,
          sortBy,
          isDeleted,
          targetType,
          targetId,
          feedType: postFeedType,
        };

        query = createQuery(queryPosts, queryData);
      }

      runQuery(query, ({ data, ...metadata }) => {
        if (reset) setPosts({});

        setPosts(prevPosts => ({ ...prevPosts, ...data }));

        // @ts-ignore
        setMetadata(metadata);
      });
    },
    [feedType, isDeleted, postFeedType, sortBy, targetId, targetType],
  );

  useEffect(() => {
    if (!targetId || !targetType) {
      return () => {
        //
      };
    }

    return observePosts(
      { targetId, targetType },
      {
        onEvent: (action, post) => {
          if (action === 'onDelete') {
            setPosts(prevState => {
              const state = { ...prevState };

              delete state[post.localId];
              return state;
            });
          } else if (action === 'onCreate') {
            setPosts(prevState => {
              return { [post.localId]: post, ...prevState };
            });

            flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
          }
        },
      },
    );
  }, [targetId, targetType]);

  const onRefresh = useCallback(() => {
    setLoading(LoadingState.IS_REFRESHING);
    onQueryPost({ reset: true });
  }, [onQueryPost]);

  useEffect(() => {
    onQueryPost({ reset: true });
  }, [onQueryPost]);

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
      onQueryPost({ page: nextPage });
    }
  };

  const data = Object.values(posts);
  const errorText = getErrorMessage(error);

  return (
    <FlatList
      data={data}
      ref={flatlistRef}
      onRefresh={onRefresh}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={header}
      onEndReached={handleLoadMore}
      keyExtractor={post => post.postId}
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
        <Surface style={styles.postItem}>
          <PostItem
            post={item}
            onPress={() => {
              navigation.navigate('Post', { post: item });
            }}
          />
        </Surface>
      )}
    />
  );
};

const styles = StyleSheet.create({
  isLoadingOrEmpty: { padding: 20 },
  helperText: { textAlign: 'center', padding: 20, marginTop: 20 },
  list: { margin: 5 },
  text: { marginBottom: 10 },
  postItem: {
    flex: 1,
    margin: 12,
    borderRadius: 5,
  },
});

export default FeedComponent;
