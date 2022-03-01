/* eslint-disable react/jsx-props-no-spreading */
import { View, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useEffect, useRef, useCallback } from 'react';
import {
  queryComments,
  createQuery,
  runQuery,
  observeComments,
  sortBySegmentNumber,
} from '@amityco/ts-sdk';

import { t } from 'i18n';
import getErrorMessage from 'utils/getErrorMessage';

import AddComment from '../AddComment';
import CommentItem from '../CommentItem';

import Loading from '../Loading';
import EmptyComponent from '../EmptyComponent';

const QUERY_LIMIT = 10;

const Comments: VFC<{ postId: string }> = ({ postId }) => {
  const [isDeleted] = useState(false);
  const [isEdit, setIsEdit] = useState('');
  const [isReply, setIsReply] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [comments, setComments] = useState<Amity.Comment[]>([]);

  const [{ error, loading, prevPage }, setMetadata] = useState<Amity.SnapshotOptions & Amity.Pages>(
    {
      prevPage: null,
      nextPage: null,
      loading: false,
      origin: 'local',
    },
  );

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
    [isDeleted, postId],
  );

  useEffect(
    () =>
      observeComments(postId, {
        onEvent: (action, comment) => {
          if (!comment.parentId) {
            if (action === 'onCreate') {
              setComments(prevState => [comment, ...prevState]);

              flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
            } else if (action === 'onDelete')
              setComments(prevState => prevState.filter(c => c.commentId !== comment.commentId));
          }
        },
      }),
    [postId],
  );

  const onRefresh = useCallback(() => {
    if (isRefreshing) {
      setIsRefreshing(true);
      onQueryComment({ reset: true });
    }
  }, [isRefreshing, onQueryComment]);

  useEffect(() => {
    onQueryComment({ reset: true });
  }, [onQueryComment]);

  const handleLoadMore = () => {
    if (prevPage) {
      onQueryComment({ page: prevPage });
    }
  };

  const onCloseAddComment = useCallback(() => {
    setIsEdit('');
    setIsReply('');
  }, []);

  const errorText = getErrorMessage(error);

  const data = comments
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
        refreshing={isRefreshing}
        ListEmptyComponent={
          loading ? <EmptyComponent errorText={error ? errorText : undefined} /> : null
        }
        ListFooterComponent={loading ? <Loading /> : undefined}
        renderItem={({ item }) => (
          <CommentItem
            {...item}
            postId={postId}
            onEdit={setIsEdit}
            onReply={setIsReply}
            onPress={() => {
              navigation.navigate('Comments', { postId, parentId: item.commentId });
            }}
          />
        )}
        onRefresh={onRefresh}
      />

      {prevPage && (
        <Button mode="contained" onPress={handleLoadMore}>
          {t('load_more')}
        </Button>
      )}
    </View>
  );
};

export default Comments;
