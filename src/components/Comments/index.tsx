/* eslint-disable react/jsx-props-no-spreading */
import { View, FlatList } from 'react-native';
import React, { VFC, useState, useEffect, useRef, useCallback } from 'react';
import {
  queryComments,
  createQuery,
  runQuery,
  observeComments,
  sortByLastCreated,
} from '@amityco/ts-sdk';

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

  const [{ error, nextPage }, setMetadata] = useState<Amity.QueryMetadata & Amity.Pages>({
    nextPage: null,
    prevPage: null,
  });

  const flatListRef = useRef<FlatList<Amity.Comment>>(null);

  const onQueryComment = useCallback(
    async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
      const queryData = {
        page,
        postId,
        isDeleted,
      };

      runQuery(
        createQuery(queryComments, queryData),
        ({ data, loading: loading_, ...metadata }) => {
          if (reset) setComments({});

          setComments(prevComments => ({ ...prevComments, ...data }));

          // @ts-ignore
          setMetadata(metadata);

          if (!loading_) {
            setLoading(LoadingState.NOT_LOADING);
          }
        },
      );
    },
    [isDeleted, postId],
  );

  useEffect(
    () =>
      observeComments(postId, {
        onEvent: (action, comment) => {
          if (!comment.parentId) {
            setComments(prevState => {
              return { ...prevState, [comment.localId]: comment };
            });

            if (action === 'onCreate') {
              flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
            }
          }
        },
      }),
    [postId],
  );

  const onRefresh = useCallback(() => {
    setLoading(LoadingState.IS_REFRESHING);
    onQueryComment({ reset: true });
  }, [onQueryComment]);

  useEffect(() => {
    onQueryComment({ reset: true });
  }, [onQueryComment]);

  const handleLoadMore = () => {
    if (nextPage) {
      setLoading(LoadingState.IS_LOADING_MORE);
      onQueryComment({ page: nextPage });
    }
  };

  const onCloseAddComment = useCallback(() => {
    setIsEdit('');
    setIsReply('');
  }, []);

  const errorText = getErrorMessage(error);

  const data = Object.values(comments)
    .filter(post => (!isDeleted ? !post.isDeleted : true))
    .sort(sortByLastCreated);
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
        renderItem={({ item }) => (
          <CommentItem {...item} postId={postId} onEdit={setIsEdit} onReply={setIsReply} />
        )}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
      />
    </View>
  );
};

export default Comments;
