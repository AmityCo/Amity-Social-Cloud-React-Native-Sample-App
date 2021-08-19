/* eslint-disable react/jsx-props-no-spreading */
import { Surface } from 'react-native-paper';
import { StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useEffect, useRef, useCallback } from 'react';
import { queryPosts, createQuery, runQuery, observePosts } from '@amityco/ts-sdk';

import { EmptyComponent, PostItem, Loading } from 'components';

import useAuth from 'hooks/useAuth';
import handleError from 'utils/handleError';

type CommentsType = Pick<Amity.Community, 'communityId'>;

const QUERY_LIMIT = 10;

const CommunityFeed: VFC<CommentsType> = ({ communityId }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [pages, setPages] = useState<Amity.Pages>();
  const [currentPage, setCurrentPage] = useState<Amity.Page>();
  const [posts, setPosts] = useState<Record<string, Amity.Post>>({});

  const flatlistRef = useRef<FlatList<Amity.Post>>(null);

  const navigation = useNavigation();

  useEffect(() => {
    if (currentPage) {
      onQueryPost();
      setLoading(true);
    } else {
      onRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const onQueryPost = async () => {
    setLoading(true);
    try {
      const queryData = {
        targetType: 'community',
        targetId: communityId,
        isDeleted: false,
      };

      runQuery(createQuery(queryPosts, { ...queryData, page: currentPage }), result => {
        if (!result.data) return;
        const { data, nextPage, prevPage, loading: loadingStack, error: errorStack } = result;

        if (errorStack) {
          const errorText = handleError(errorStack);

          setError(errorText);
        }

        if (isRefreshing) {
          setPosts(data);
        } else {
          setPosts(prevPosts => ({ ...prevPosts, ...data }));
        }

        setIsRefreshing(false);
        setIsLoadingMore(false);
        setLoading(!!loadingStack);
        setPages({ nextPage, prevPage });
      });
    } catch (e) {
      const errorText = handleError(e);

      setError(errorText);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(
    () =>
      observePosts(
        { targetId: communityId, targetType: 'community' },
        {
          onEvent: (action, post) => {
            if (action === 'onDelete') {
              setPosts(prevState => {
                // eslint-disable-next-line no-param-reassign
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
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleLoadMore = () => {
    if (pages?.nextPage) {
      setIsLoadingMore(true);
      setCurrentPage(pages.nextPage);
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setCurrentPage({ before: 0, limit: QUERY_LIMIT });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = Object.values(posts);

  return (
    <FlatList
      data={data}
      ref={flatlistRef}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      onEndReachedThreshold={0.5}
      onEndReached={handleLoadMore}
      keyExtractor={post => post.postId}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={isLoadingMore ? <Loading /> : undefined}
      ListEmptyComponent={<EmptyComponent loading={loading || isRefreshing} errorText={error} />}
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

export default CommunityFeed;
