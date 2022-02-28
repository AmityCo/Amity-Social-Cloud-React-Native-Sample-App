/* eslint-disable react/jsx-props-no-spreading */
import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { VFC, useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import {
  queryComments,
  runQuery,
  createQuery,
  sortBySegmentNumber,
  // observeComments,
} from '@amityco/ts-sdk';

import { Loading, Header } from 'components';

import useAuth from 'hooks/useAuth';
// import getErrorMessage from 'utils/getErrorMessage';

import { LoadingState, DrawerStackHeaderProps } from 'types';

import styles from './styles';

const QUERY_LIMIT = 10;

const CommentsScreen: VFC = () => {
  // const [isReply, setIsReply] = useState('');
  // const [isEditId, setIsEditId] = useState('');
  // const [filter] = useState<'all' | 'flagged'>('all');
  const [loading, setLoading] = useState<LoadingState>(LoadingState.NOT_LOADING);
  // const [sortBy] = useState<'displayName' | 'lastCreated' | 'firstCreated'>('lastCreated');

  const [comments, setComments] = useState<Amity.Comment[]>([]);

  const [{ prevPage }, setMetadata] = useState<Amity.SnapshotOptions & Amity.Pages>({
    error: null,
    nextPage: null,
    prevPage: null,
    loading: false,
    origin: 'local',
  });

  const flatListRef = useRef<FlatList<Amity.Comment>>(null);

  const route = useRoute();
  // const { client } = useAuth();
  const navigation = useNavigation();
  const { postId } = route.params as { postId: Amity.Post['postId'] };

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
        referenceId: postId,
        referenceType: 'post',
      };

      runQuery(createQuery(queryComments, queryData), ({ data, ...metadata }) => {
        // console.log({ data });
        if (data) {
          // @ts-ignore
          setComments(prevComments => (reset ? data : [...prevComments, ...data]));
        }

        setMetadata(metadata);
        if (!metadata.loading) {
          setLoading(LoadingState.NOT_LOADING);
        }
      });
    },
    [postId],
  );

  // console.log({
  //   comments,
  //   client: Object.keys(client.cache?.lookup).filter(a => !a.indexOf('comment#')),
  // });

  // useEffect(
  //   () =>
  //     observeComments(postId, {
  //       onEvent: (action, comment) => {
  //         console.log(22, comment);
  //         // if (!comment.parentId) {
  //         //   setComments(prevState => {
  //         //     console.log({ comment, prevState, lol: [...prevState, comment] });
  //         //     // return { ...prevState, [comment.localId]: comment };
  //         //   });

  //         //   if (action === 'onCreate') {
  //         //     flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  //         //   }
  //         // }
  //       },
  //     }),
  //   [comments, postId],
  // );

  useEffect(() => {
    onQueryComment({ reset: true });
  }, [onQueryComment]);

  const onRefresh = useCallback(() => {
    setLoading(LoadingState.IS_REFRESHING);
    onQueryComment({ reset: true });
  }, [onQueryComment]);

  const handleLoadMore = () => {
    // console.log({ nextPage, prevPage });
    if (prevPage) {
      setLoading(LoadingState.IS_LOADING_MORE);
      onQueryComment({ page: prevPage });
    }
  };

  // const onCloseUpdateUser = useCallback(() => {
  //   setIsEditId('');
  // }, []);

  // const errorText = getErrorMessage(error);
  const data = Object.values(comments).sort(sortBySegmentNumber).reverse();

  return (
    <Surface style={styles.container}>
      <FlatList
        data={data}
        ref={flatListRef}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        keyExtractor={user => user.commentId}
        showsVerticalScrollIndicator={false}
        refreshing={loading === LoadingState.IS_REFRESHING}
        ListFooterComponent={loading === LoadingState.IS_LOADING_MORE ? <Loading /> : undefined}
        // ListEmptyComponent={
        //   loading === LoadingState.NOT_LOADING ? (
        //     <EmptyComponent errorText={error ? errorText : undefined} />
        //   ) : null
        // }
        renderItem={() => (
          <Surface style={styles.userItem}>
            {/* <CommentItem {...item} onEdit={setIsEditId} postId={postId} onReply={setIsReply} /> */}
          </Surface>
        )}
      />
      {/*
      {isEditId !== '' && <UpdateUser onClose={onCloseUpdateUser} isEditId={isEditId} />} */}
    </Surface>
  );
};

export default CommentsScreen;
