/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Surface, Appbar } from 'react-native-paper';
import { StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderProps } from '@react-navigation/stack';
import React, { VFC, useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';
import { queryPosts, createQuery, runQuery, observePosts, queryGlobalFeed } from '@amityco/ts-sdk';

import { Header, FAB, EmptyComponent, AddPost, PostItem, Loading } from 'components';

import useAuth from 'hooks/useAuth';
import handleError from 'utils/handleError';

import { PostFeedType, FeedType, PostSortBy } from 'types';

import FilterDialog from './FilterDialog';

const QUERY_LIMIT = 20;

const FeedScreen: VFC = () => {
  const [error, setError] = useState('');
  const [isEditId, setIsEditId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [targetType] = React.useState<Amity.PostTargetType>('user');
  const [feedType, setFeedType] = React.useState<FeedType>(FeedType.Normal);
  const [postFeedType] = React.useState<PostFeedType>(PostFeedType.PUBLISHED);
  const [sortBy, setSortBy] = React.useState<PostSortBy>(PostSortBy.LAST_CREATED);
  const [isDeleted, setIsDeleted] = React.useState<Amity.Post['isDeleted']>(false);

  const [pages, setPages] = useState<Amity.Pages>();
  const [currentPage, setCurrentPage] = useState<Amity.Page>();
  const [posts, setPosts] = useState<Record<string, Amity.Post>>({});

  const flatlistRef = useRef<FlatList<Amity.Post>>(null);

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
    } else {
      onRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    // console.log({ sortBy, isDeleted, feedType });
    onRefresh();
    flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, isDeleted, feedType]);

  const onQueryPost = async () => {
    let query = createQuery(queryGlobalFeed, { page: currentPage });

    if (feedType === FeedType.Normal) {
      const queryData = {
        sortBy,
        isDeleted,
        targetType,
        feedType: postFeedType,
        targetId: client.userId!,
      };

      query = createQuery(queryPosts, { ...queryData, page: currentPage });
    }

    runQuery(query, result => {
      if (!result.data) return;
      const { data, nextPage, prevPage, loading: loadingStack, error: errorStack } = result;
      if (errorStack) {
        const errorText = handleError(errorStack);

        setError(errorText);
      }

      // console.log({ result, query });
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
            }
          },
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [targetType],
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
            <PostItem
              post={{ ...item }}
              onEditPost={setIsEditId}
              onPress={() => {
                navigation.navigate('Post', { post: item });
              }}
            />
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
        feedType={feedType}
        setSortBy={setSortBy}
        isDeleted={isDeleted}
        showDialog={showDialog}
        setFeedType={setFeedType}
        setIsDeleted={setIsDeleted}
        setShowDialog={setShowDialog}
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
