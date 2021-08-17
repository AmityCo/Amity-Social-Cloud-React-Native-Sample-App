/* eslint-disable react/jsx-props-no-spreading */
import { Surface } from 'react-native-paper';
import { queryPosts, createQuery, runQuery, observePosts } from '@amityco/ts-sdk';
import { StyleSheet, FlatList } from 'react-native';
import React, { VFC, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { EmptyComponent, PostItem, Loading } from 'components';

import handleError from 'utils/handleError';

type CommentsType = Pick<Amity.User, 'userId'>;

const QUERY_LIMIT = 10;

const Feeds: VFC<CommentsType & { header: React.ReactElement }> = ({ userId, header }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [pages, setPages] = useState<Amity.Pages>();
  const [currentPage, setCurrentPage] = useState<Amity.Page>();
  const [posts, setPosts] = useState<Record<string, Amity.Post>>({});

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
        targetType: 'user',
        targetId: userId,
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
        { targetId: userId, targetType: 'user' },
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
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={header}
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

export default Feeds;
