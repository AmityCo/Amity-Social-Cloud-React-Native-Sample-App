/* eslint-disable react/jsx-props-no-spreading */
import { View, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useEffect, useRef, useCallback } from 'react';
import {
  queryComments,
  createQuery,
  runQuery,
  // observeComments,
  sortBySegmentNumber,
} from '@amityco/ts-sdk';

import { t } from 'i18n';
import getErrorMessage from 'utils/getErrorMessage';

import { LoadingState } from 'types';

import AddComment from '../AddComment';
import CommentItem from '../CommentItem';

import Loading from '../Loading';
import EmptyComponent from '../EmptyComponent';

const QUERY_LIMIT = 10;

const Comments: VFC<{ postId: string }> = ({ postId }) => {
  const [isDeleted] = useState(false);
  const [isEdit, setIsEdit] = useState('');
  const [isReply, setIsReply] = useState('');

  const [loading, setLoading] = useState<LoadingState>(LoadingState.NOT_LOADING);

  const [comments, setComments] = useState<Record<string, Amity.Comment>>({});

  const [{ error }, setMetadata] = useState<Amity.SnapshotOptions & Amity.Pages>({
    nextPage: null,
    prevPage: null,
    loading: false,
    origin: 'local',
  });

  const flatListRef = useRef<FlatList<Amity.Comment>>(null);

  const navigation = useNavigation();

  const onQueryComment = useCallback(
    async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
      const queryData: Parameters<typeof queryComments>[0] = {
        page,
        isDeleted,
        referenceId: postId,
        referenceType: 'post',
      };

      runQuery(createQuery(queryComments, queryData), ({ loading: loading_, ...metadata }) => {
        if (reset) setComments({});
        // console.log({ page, data, loading: loading_, metadata });
        // setComments(prevComments => ({ ...prevComments, ...data }));

        // @ts-ignore
        setMetadata(metadata);

        if (!loading_) {
          setLoading(LoadingState.NOT_LOADING);
        }
      });
    },
    [isDeleted, postId],
  );

  // useEffect(
  //   () =>
  //     observeComments(postId, {
  //       onEvent: (action, comment) => {
  //         console.log(1, comment);
  //         if (!comment.parentId) {
  //           setComments(prevState => {
  //             return { ...prevState, [comment.localId]: comment };
  //           });

  //           if (action === 'onCreate') {
  //             flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  //           }
  //         }
  //       },
  //     }),
  //   [postId],
  // );

  const onRefresh = useCallback(() => {
    setLoading(LoadingState.IS_REFRESHING);
    onQueryComment({ reset: true });
  }, [onQueryComment]);

  useEffect(() => {
    onQueryComment({ reset: true });
  }, [onQueryComment]);

  // const handleLoadMore = (isLoadingMore: boolean) => {
  //   if (isLoadingMore && prevPage) {
  //     setLoading(LoadingState.IS_LOADING_MORE);
  //     onQueryComment({ page: prevPage });
  //   }
  // };

  const onCloseAddComment = useCallback(() => {
    setIsEdit('');
    setIsReply('');
  }, []);

  const errorText = getErrorMessage(error);

  const data = Object.values(comments)
    .filter(post => (!isDeleted ? !post.isDeleted : true))
    .sort(sortBySegmentNumber)
    .reverse();
  const parent = data.find(cm => cm.commentId === isReply);

  return (
    <View>
      <AddComment
        postId={postId}
        isEdit={isEdit}
        isReply={isReply}
        parentUserId={parent?.userId}
        onRefresh={onCloseAddComment}
        onCancel={onCloseAddComment}
      />

      <FlatList
        ref={flatListRef}
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={comment => comment.commentId}
        refreshing={loading === LoadingState.IS_REFRESHING}
        ListEmptyComponent={
          loading === LoadingState.NOT_LOADING ? (
            <EmptyComponent errorText={error ? errorText : undefined} />
          ) : null
        }
        ListFooterComponent={loading === LoadingState.IS_LOADING_MORE ? <Loading /> : undefined}
        renderItem={({ item }) => <CommentItem {...item} postId={postId} onReply={setIsReply} />}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.5}
        // onEndReached={handleLoadMore}
      />

      <Button
        // mode="contained"
        onPress={() => {
          navigation.navigate('Comments', { postId });
        }}
      >
        {t('comments.load_more')}
      </Button>
    </View>
  );
};

export default Comments;
