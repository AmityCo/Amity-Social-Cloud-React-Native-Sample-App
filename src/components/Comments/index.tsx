/* eslint-disable react/jsx-props-no-spreading */
import { View, FlatList } from 'react-native';
import { queryComments, createQuery, runQuery, observeComments } from '@amityco/ts-sdk';
import React, { VFC, useState, useEffect, useRef, useCallback } from 'react';

import handleError from 'utils/handleError';

import AddComment from './AddComment';
import CommentItem from './CommentItem';

import Loading from '../Loading';
import EmptyComponent from '../EmptyComponent';

type CommentsType = Pick<Amity.Post, 'postId'>;

const QUERY_LIMIT = 5;

const Comments: VFC<CommentsType> = ({ postId }) => {
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState('');
  const [isReply, setIsReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [pages, setPages] = useState<Amity.Pages>();
  const [currentPage, setCurrentPage] = useState<Amity.Page>();
  const [comments, setComments] = useState<Record<string, Amity.Comment>>({});

  const flatlistRef = useRef<FlatList<Amity.Comment>>(null);

  useEffect(() => {
    setCurrentPage({ before: 0, limit: QUERY_LIMIT });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // query per page
  useEffect(() => {
    if (currentPage) {
      onQueryComment();
      setLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const onQueryComment = async () => {
    try {
      const queryData = {
        postId,
        isDeleted: false,
      };

      runQuery(createQuery(queryComments, { ...queryData, page: currentPage }), result => {
        if (!result.data) return;
        const { data, nextPage, prevPage, loading: loadingStack, error: errorStack } = result;

        if (errorStack) {
          const errorText = handleError(errorStack);

          setError(errorText);
        }

        setIsLoadingMore(false);
        setLoading(!!loadingStack);
        setPages({ nextPage, prevPage });
        setComments(prevComments => ({ ...prevComments, ...data }));
      });
    } catch (e) {
      const errorText = handleError(e);

      setError(errorText);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(
    () =>
      observeComments(postId, {
        onEvent: (action, post) => {
          if (action === 'onDelete') {
            setComments(prevState => {
              // eslint-disable-next-line no-param-reassign
              const state = { ...prevState };

              delete state[post.localId];
              return state;
            });
          } else if (action === 'onCreate') {
            setComments(prevState => {
              return { [post.localId]: post, ...prevState };
            });

            flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
          }
        },
      }),
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

  const data = Object.values(comments);
  const parent = data.find(cm => cm.commentId === isReply);

  return (
    <View>
      <AddComment
        postId={postId}
        onRefresh={() => {
          setIsEdit('');
          setIsReply('');
        }}
        onCancel={() => {
          setIsEdit('');
          setIsReply('');
        }}
        isEdit={isEdit}
        isReply={isReply}
        parentUserId={parent?.userId}
      />

      <FlatList
        data={data}
        ref={flatlistRef}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        showsVerticalScrollIndicator={false}
        keyExtractor={comment => comment.commentId}
        ListFooterComponent={isLoadingMore ? <Loading /> : undefined}
        ListEmptyComponent={<EmptyComponent loading={loading || isRefreshing} errorText={error} />}
        renderItem={({ item }) => (
          <CommentItem {...item} onEdit={setIsEdit} postId={postId} onReply={setIsReply} />
        )}
      />
    </View>
  );
};

export default Comments;
