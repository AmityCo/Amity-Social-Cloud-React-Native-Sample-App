/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Surface, Appbar } from 'react-native-paper';
import { StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderProps } from '@react-navigation/stack';
import { queryPosts, createQuery, runQuery, observePosts } from '@amityco/ts-sdk';
import React, { VFC, useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';

import { Header, FAB, EmptyComponent, AddPost, PostItem, Loading } from 'components';

import useAuth from 'hooks/useAuth';
import handleError from 'utils/handleError';

import { PostFeedType, PostFeedTypeeee, PostSortBy, PostItemProps } from 'types';

import FilterDialog from './FilterDialog';

const QUERY_LIMIT = 10;

const FeedScreen: VFC = () => {
  const [error, setError] = useState('');
  const [isEditId, setIsEditId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [targetType] = React.useState<ASC.PostTargetType>('user');
  const [feedType] = React.useState<PostFeedType>(PostFeedType.PUBLISHED);
  const [isDeleted, setIsDeleted] = React.useState<ASC.Post['isDeleted']>(false);
  const [sortBy, setSortBy] = React.useState<PostSortBy>(PostSortBy.LAST_CREATED);
  const [feedTypeee, setFeedTypeee] = React.useState<PostFeedTypeeee>(PostFeedTypeeee.Normal);

  const [pages, setPages] = useState<ASC.Pages>({});
  const [currentPage, setCurrentPage] = useState<ASC.Page>();
  const [posts, setPosts] = useState<Record<string, ASC.Post>>({});

  const flatlistRef = useRef<FlatList<PostItemProps>>(null);

  const { client } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, previous, navigation: nav }: StackHeaderProps) => (
        <Header
          scene={scene}
          navigation={nav}
          previous={previous}
          right={<Appbar.Action icon="filter" onPress={() => setShowDialog(true)} />}
        />
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
      onQueryPost();
      setLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    onRefresh();
    flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, isDeleted]);

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

  // TODO what if there is no client.userId? try for userIsDisconnected // try for reproduce
  const onQueryPost = async () => {
    if (!client.userId) {
      setError('UserId is not reachable!');
      return;
    }

    setError('');

    try {
      const queryData = {
        sortBy,
        feedType,
        isDeleted,
        targetType,
        targetId: client.userId!,
      };

      const query = createQuery(queryPosts, { ...queryData, page: currentPage });
      runQuery(query, mergePosts);
    } catch (e) {
      const errorText = handleError(e);

      setError(errorText);
    }
  };

  useEffect(
    () =>
      observePosts(
        { targetId: client.userId!, targetType },
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
            } else {
              setPosts(prevState => {
                return { ...prevState, [post.localId]: post };
              });
            }
          },
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [targetType],
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
    <Surface style={styles.container}>
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
            <PostItem {...item} onEditPost={setIsEditId} />
          </Surface>
        )}
      />

      <AddPost
        onClose={() => {
          setIsEditId('');
          setShowAddPost(false);
        }}
        isEditId={isEditId}
        visible={showAddPost || isEditId !== ''}
      />

      <FAB
        icon="plus"
        onPress={() => {
          setShowAddPost(true);
        }}
      />

      <FilterDialog
        sortBy={sortBy}
        setSortBy={setSortBy}
        isDeleted={isDeleted}
        showDialog={showDialog}
        feedTypeee={feedTypeee}
        setIsDeleted={setIsDeleted}
        setShowDialog={setShowDialog}
        setFeedTypeee={setFeedTypeee}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postItem: {
    flex: 1,
    margin: 12,
    borderRadius: 5,
  },
  errorText: { fontSize: 18, alignSelf: 'center', marginTop: 25, marginBottom: 15 },
});

export default FeedScreen;
