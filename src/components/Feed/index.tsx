/* eslint-disable react/jsx-props-no-spreading */
import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useEffect, useRef, useCallback, ReactElement, useMemo } from 'react';
import {
  queryPosts,
  createQuery,
  runQuery,
  observePosts,
  queryGlobalFeed,
  sortByLastCreated,
} from '@amityco/ts-sdk';

import getErrorMessage from 'utils/getErrorMessage';
import { PostFeedType, FeedTargetType } from 'types';

import Loading from '../Loading';
import PostItem from '../PostItem';
import EmptyComponent from '../EmptyComponent';

import styles from './styles';

const QUERY_LIMIT = 10;

type FeedComponentType = {
  targetId: string;
  targetType: string;
  isDeleted?: boolean;
  feedTargetType?: FeedTargetType;
  postFeedType?: PostFeedType;
  header?: ReactElement;
  useCustomRanking?: boolean;
};

const FeedComponent: VFC<FeedComponentType> = ({
  header,
  targetId,
  targetType,
  isDeleted = false,
  feedTargetType = FeedTargetType.Normal,
  postFeedType = PostFeedType.PUBLISHED,
  useCustomRanking = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [posts, setPosts] = useState<Amity.Post[]>([]);
  const [options, setOptions] =
    useState<Amity.RunQueryOptions<typeof queryPosts | typeof queryGlobalFeed>>();

  const { loading, nextPage, error } = options ?? {};

  const flatListRef = useRef<FlatList<Amity.Post>>(null);

  const navigation = useNavigation();

  const onQueryPosts = useCallback(
    async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
      let query = createQuery(queryGlobalFeed, { page, useCustomRanking });

      if (feedTargetType === FeedTargetType.Normal) {
        const queryData = {
          page,
          isDeleted,
          targetType,
          targetId,
          feedType: postFeedType,
        };

        // @ts-ignore
        query = createQuery(queryPosts, queryData);
      }

      runQuery(query, ({ data, ...metadata }) => {
        if (data) {
          setPosts(prevPosts => (reset ? data : [...prevPosts, ...data]));
        }

        setOptions(metadata);

        if (metadata?.loading === false) {
          setIsRefreshing(false);
        }
      });
    },
    [feedTargetType, isDeleted, postFeedType, targetId, targetType, useCustomRanking],
  );

  const handleLoadMore = () => {
    if (nextPage) {
      onQueryPosts({ page: nextPage });
    }
  };

  useEffect(
    () =>
      observePosts(
        { targetId, targetType },
        {
          onEvent: (action, post) => {
            if (action === 'onCreate') {
              setPosts(prevPosts => [post, ...prevPosts]);

              flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
            }
            // list of actions : ...
          },
        },
      ),
    [targetId, targetType],
  );

  const onRefresh = useCallback(() => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      onQueryPosts({ reset: true });
    }
  }, [isRefreshing, onQueryPosts]);

  useEffect(() => {
    onQueryPosts({ reset: true });
  }, [onQueryPosts]);

  useEffect(() => {
    // @ts-ignore
    const unsubscribe = navigation?.getParent()?.addListener('tabPress', () => {
      onRefresh();
      flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    });

    return unsubscribe;
  }, [navigation, onRefresh]);

  const errorText = getErrorMessage(error);

  const data = useMemo(() => {
    const allPosts = posts.filter(post => (!isDeleted ? !post.isDeleted : true));

    if (feedTargetType === FeedTargetType.Normal) {
      allPosts.sort(sortByLastCreated);
    }

    return allPosts;
  }, [feedTargetType, isDeleted, posts]);

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      ListHeaderComponent={header}
      keyExtractor={post => post.postId}
      showsVerticalScrollIndicator={false}
      refreshing={isRefreshing}
      ListFooterComponent={loading ? <Loading /> : undefined}
      ListEmptyComponent={
        loading ? <EmptyComponent errorText={error ? errorText : undefined} /> : null
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
