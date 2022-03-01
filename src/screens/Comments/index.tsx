/* eslint-disable react/jsx-props-no-spreading */
import { Surface } from 'react-native-paper';
import { FlatList, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { VFC, useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import {
  queryComments,
  runQuery,
  createQuery,
  sortBySegmentNumber,
  observeComments,
} from '@amityco/ts-sdk';

import { Loading, Header, EmptyComponent, CommentItem } from 'components';

import getErrorMessage from 'utils/getErrorMessage';

import { DrawerStackHeaderProps } from 'types';

import styles from './styles';

const QUERY_LIMIT = 10;

const CommentsScreen: VFC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [comments, setComments] = useState<Amity.Comment[]>([]);

  const [{ prevPage, loading, error }, setMetadata] = useState<Amity.SnapshotOptions & Amity.Pages>(
    {
      error: null,
      nextPage: null,
      prevPage: null,
      loading: false,
      origin: 'local',
    },
  );

  const flatListRef = useRef<FlatList<Amity.Comment>>(null);

  const route = useRoute();
  const navigation = useNavigation();
  const { postId, parentId } = route.params as {
    postId: Amity.Post['postId'];
    parentId: Amity.Comment['commentId'];
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Comments',
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
  }, [navigation]);

  const onQueryComment = useCallback(
    async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
      const queryData: Parameters<typeof queryComments>[0] = {
        page,
        parentId,
        referenceId: postId,
        referenceType: 'post',
      };

      runQuery(createQuery(queryComments, queryData), ({ data, ...metadata }) => {
        if (data) {
          setComments(prevComments => (reset ? data : [...prevComments, ...data]));
        }

        setMetadata(metadata);

        if (!metadata.loading) {
          setIsRefreshing(false);
        }
      });
    },
    [parentId, postId],
  );

  useEffect(
    () =>
      observeComments(postId, {
        onEvent: (action, comment) => {
          if (parentId === comment.parentId) {
            if (action === 'onCreate') setComments(prevState => [comment, ...prevState]);
            if (action === 'onDelete')
              setComments(prevState => prevState.filter(c => c.commentId !== comment.commentId));
          }
        },
      }),
    [comments, parentId, postId],
  );

  useEffect(() => {
    onQueryComment({ reset: true });
  }, [onQueryComment]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    onQueryComment({ reset: true });
  }, [onQueryComment]);

  const handleLoadMore = () => {
    if (prevPage) {
      onQueryComment({ page: prevPage });
    }
  };

  const errorText = getErrorMessage(error);
  const data = comments.sort(sortBySegmentNumber).reverse();

  return (
    <Surface style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={user => user.commentId}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        ListFooterComponent={loading ? <Loading /> : undefined}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <CommentItem {...item} postId={postId} />
          </View>
        )}
        ListEmptyComponent={
          !loading ? <EmptyComponent errorText={error ? errorText : undefined} /> : null
        }
        onRefresh={onRefresh}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
      />
    </Surface>
  );
};

export default CommentsScreen;
