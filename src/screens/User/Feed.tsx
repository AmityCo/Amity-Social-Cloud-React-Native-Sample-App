/* eslint-disable react/jsx-props-no-spreading */
import { Surface } from 'react-native-paper';
import { queryPosts, createQuery, runQuery, observePosts } from '@amityco/ts-sdk';
import { StyleSheet, FlatList } from 'react-native';
import React, { VFC, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { EmptyComponent, PostItem, Loading } from 'components';

import handleError from 'utils/handleError';

type CommentsType = Pick<ASC.User, 'userId'>;

const QUERY_LIMIT = 10;

const Feeds: VFC<CommentsType> = ({ userId }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [pages, setPages] = useState<ASC.Pages>({});
  const [currentPage, setCurrentPage] = useState<ASC.Page>();
  const [posts, setPosts] = useState<Record<string, ASC.Post>>({});

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

  const mergePosts = ([newPosts, newPages]: ASC.Paged<Record<string, ASC.Post>>) => {
    if (isRefreshing) {
      setPosts(newPosts);
    } else {
      setPosts(prevPosts => ({ ...prevPosts, ...newPosts }));
    }

    setPages(newPages);

    setLoading(false);
    setIsRefreshing(false);
    setIsLoadingMore(false);
  };

  const onQueryPost = async () => {
    setLoading(true);
    try {
      const queryData = {
        targetType: 'user',
        targetId: userId,
      };

      const query = createQuery(queryPosts, { ...queryData, page: currentPage });
      runQuery(query, mergePosts);
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
            } else {
              setPosts(prevState => {
                return { ...prevState, [post.localId]: post };
              });
            }
          },
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleLoadMore = () => {
    if (pages.nextPage) {
      setIsLoadingMore(true);
      setCurrentPage(pages.nextPage);
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setCurrentPage({ before: 0, limit: QUERY_LIMIT });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = Object.values(posts).map(post => {
    return {
      ...post,
      onPress: () => {
        navigation.navigate('Post', post);
      },
    };
  });

  return (
    <FlatList
      data={data}
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
          <PostItem {...item} />
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
