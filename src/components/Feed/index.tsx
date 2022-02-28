/* eslint-disable react/jsx-props-no-spreading */
import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useEffect, useRef, useCallback, ReactElement } from 'react';
import {
  queryPosts,
  createQuery,
  runQuery,
  // observePosts,
  // queryGlobalFeed,
  sortByLastCreated,
} from '@amityco/ts-sdk';

import { LoadingState, PostFeedType, FeedTargetType } from 'types';

import Loading from '../Loading';
import PostItem from '../PostItem';
// import EmptyComponent from '../EmptyComponent';

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
  // feedTargetType = FeedTargetType.Normal,
  postFeedType = PostFeedType.PUBLISHED,
}) => {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.NOT_LOADING);

  const [posts, setPosts] = useState<Amity.Post[]>([]);

  const [{ nextPage }, setMetadata] = useState<Amity.SnapshotOptions & Amity.Pages>({
    error: null,
    nextPage: null,
    prevPage: null,
    loading: false,
    origin: 'local',
  });

  const flatListRef = useRef<FlatList<Amity.Post>>(null);

  const navigation = useNavigation();

  const onQueryPost = useCallback(
    async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
      // let query = createQuery(queryGlobalFeed, { page });

      // if (feedTargetType === FeedTargetType.Normal) {
      const queryData = {
        page,
        isDeleted,
        targetType,
        targetId,
        feedType: postFeedType,
      };

      const query = createQuery(queryPosts, queryData);

      runQuery(query, ({ data, ...metadata }) => {
        if (data) {
          setPosts(prevPosts => (reset ? data : [...prevPosts, ...data]));
        }

        // console.log(page, { data, metadata });

        setMetadata(metadata);

        if (metadata?.loading === false) {
          setLoading(LoadingState.NOT_LOADING);
        }
      });
    },
    [isDeleted, postFeedType, targetId, targetType],
  );

  // console.log({ posts, nextPage, prevPage });

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
    setLoading(LoadingState.IS_REFRESHING);
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
      setLoading(LoadingState.IS_LOADING_MORE);
      onQueryPost({ page: nextPage });
    }
  };

  // const errorText = getErrorMessage(error);
  const data = posts.filter(post => (!isDeleted ? !post.isDeleted : true)).sort(sortByLastCreated);

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      ListHeaderComponent={header}
      keyExtractor={post => post.postId}
      showsVerticalScrollIndicator={false}
      refreshing={loading === LoadingState.IS_REFRESHING}
      ListFooterComponent={loading === LoadingState.IS_LOADING_MORE ? <Loading /> : undefined}
      // ListEmptyComponent={
      //   loading === LoadingState.NOT_LOADING ? (
      //     <EmptyComponent errorText={error ? errorText : undefined} />
      //   ) : null
      // }
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
