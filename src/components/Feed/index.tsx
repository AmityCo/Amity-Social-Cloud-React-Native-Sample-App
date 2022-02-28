/* eslint-disable react/jsx-props-no-spreading */
import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useEffect, useRef, useCallback, ReactElement } from 'react';
import {
  queryPosts,
  createQuery,
  runQuery,
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
};

const FeedComponent: VFC<FeedComponentType> = ({
  header,
  targetId,
  targetType,
  isDeleted = false,
  feedTargetType = FeedTargetType.Normal,
  postFeedType = PostFeedType.PUBLISHED,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [posts, setPosts] = useState<Amity.Post[]>([]);

  const [{ nextPage, error, loading }, setMetadata] = useState<Amity.SnapshotOptions & Amity.Pages>(
    {
      error: null,
      nextPage: null,
      prevPage: null,
      loading: false,
      origin: 'local',
    },
  );

  const flatListRef = useRef<FlatList<Amity.Post>>(null);

  const navigation = useNavigation();

  const onQueryPost = useCallback(
    async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
      let query = createQuery(queryGlobalFeed, { page });

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

        setMetadata(metadata);

        if (metadata?.loading === false) {
          setIsRefreshing(false);
        }
      });
    },
    [feedTargetType, isDeleted, postFeedType, targetId, targetType],
  );

  // useEffect(
  //   () =>
  //     observePosts(
  //       { targetId, targetType },
  //       {
  //         onEvent: (action, post) => {
  //           // console.log('observePosts', { action, post });
  //           // setPosts(prevState => {
  //           //   return { ...prevState, [post.localId]: post };
  //           // });
  //           // if (action === 'onCreate') {
  //           //   flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  //           // }
  //         },
  //       },
  //     ),
  //   [targetId, targetType],
  // );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    onQueryPost({ reset: true });
  }, [onQueryPost]);

  useEffect(() => {
    onQueryPost({ reset: true });
  }, [onQueryPost]);

  useEffect(() => {
    const unsubscribe = navigation?.getParent()?.addListener('tabPress', () => {
      onRefresh();
      flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    });

    return unsubscribe;
  }, [navigation, onRefresh]);

  const handleLoadMore = () => {
    if (nextPage) {
      onQueryPost({ page: nextPage });
    }
  };

  const errorText = getErrorMessage(error);
  const data = posts.filter(post => (!isDeleted ? !post.isDeleted : true)).sort(sortByLastCreated);

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
