/* eslint-disable react/jsx-props-no-spreading */
import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useEffect, useRef, useCallback, ReactElement } from 'react';
import {
  queryPosts,
  createQuery,
  runQuery,
  observePosts,
  queryGlobalFeed,
  sortByLastCreated,
} from '@amityco/ts-sdk';

import getErrorMessage from 'utils/getErrorMessage';
import { LoadingState, PostFeedType, FeedTargetType } from 'types';

import Loading from '../Loading';
import PostItem from '../PostItem';
import EmptyComponent from '../EmptyComponent';

import styles from './styles';

const QUERY_LIMIT = 10;

type FeedComponentType = {
  targetId?: string;
  targetType?: string;
  isDeleted?: boolean;
  feedTargetType?: FeedTargetType;
  postFeedType?: PostFeedType;
  header?: ReactElement;
};

const FeedComponent: VFC<FeedComponentType> = ({
  header,
  targetId,
  targetType,
  isDeleted = false,
  feedTargetType = FeedTargetType.Normal,
  postFeedType = PostFeedType.PUBLISHED,
}) => {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.NOT_LOADING);

  const [posts, setPosts] = useState<Record<string, Amity.Post>>({});

  const [{ error, nextPage }, setMetadata] = useState<Amity.QueryMetadata & Amity.Pages>({
    nextPage: null,
    prevPage: null,
  });

  const flatListRef = useRef<FlatList<Amity.Post>>(null);

  const navigation = useNavigation();

  const onQueryPost = useCallback(
    async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
      let query = createQuery(queryGlobalFeed, { page });

      if (feedTargetType === FeedTargetType.Normal) {
        const queryData = {
          page,
          targetId,
          isDeleted,
          targetType,
          feedType: postFeedType,
        };

        query = createQuery(queryPosts, queryData);
      }

      runQuery(query, ({ data, loading: loading_, ...metadata }) => {
        if (reset) setPosts({});

        setPosts(prevPosts => ({ ...prevPosts, ...data }));

        // @ts-ignore
        setMetadata(metadata);

        if (!loading_) {
          setLoading(LoadingState.NOT_LOADING);
        }
      });
    },
    [feedTargetType, isDeleted, postFeedType, targetId, targetType],
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
          setPosts(prevState => {
            return { ...prevState, [post.localId]: post };
          });

          if (action === 'onCreate') {
            flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
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
    const unsubscribe = navigation?.dangerouslyGetParent()?.addListener('tabPress', () => {
      onRefresh();
      flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    });

    return unsubscribe;
  }, [navigation, onRefresh]);

  const handleLoadMore = () => {
    if (nextPage) {
      setLoading(LoadingState.IS_LOADING_MORE);
      onQueryPost({ page: nextPage });
    }
  };

  const errorText = getErrorMessage(error);
  const data = Object.values(posts)
    .filter(post => (!isDeleted ? !post.isDeleted : true))
    .sort(sortByLastCreated);

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      ListHeaderComponent={header}
      keyExtractor={post => post.postId}
      showsVerticalScrollIndicator={false}
      refreshing={loading === LoadingState.IS_REFRESHING}
      ListFooterComponent={loading === LoadingState.IS_LOADING_MORE ? <Loading /> : undefined}
      ListEmptyComponent={
        loading === LoadingState.NOT_LOADING ? (
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
      onRefresh={onRefresh}
      onEndReachedThreshold={0.5}
      onEndReached={handleLoadMore}
    />
  );
};

export default FeedComponent;
