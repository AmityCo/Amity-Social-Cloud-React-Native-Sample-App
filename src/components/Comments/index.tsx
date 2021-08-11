/* eslint-disable react/jsx-props-no-spreading */
import { StyleSheet, View, FlatList } from 'react-native';
import { queryComments, createQuery, runQuery, observeComments } from '@amityco/ts-sdk';
import React, { VFC, useState, useEffect, useRef, useCallback } from 'react';

import handleError from 'utils/handleError';

import AddComment from './AddComment';
import CommentItem from './CommentItem';

import Loading from '../Loading';
import EmptyComponent from '../EmptyComponent';

type CommentsType = Pick<ASC.Post, 'postId'>;

const QUERY_LIMIT = 10;

const Comments: VFC<CommentsType> = ({ postId }) => {
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState('');
  const [isReply, setIsReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [pages, setPages] = useState<ASC.Pages>({});
  const [currentPage, setCurrentPage] = useState<ASC.Page>();
  const [comments, setComments] = useState<Record<string, ASC.Comment>>({});

  const flatlistRef = useRef<FlatList<ASC.Comment>>(null);

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

  const mergeComments = ([newComments, newPages]: ASC.Paged<Record<string, ASC.Comment>>) => {
    setComments(prevComments => ({ ...prevComments, ...newComments }));

    setPages(newPages);

    setLoading(false);
    setIsLoadingMore(false);
  };

  const onQueryComment = async () => {
    try {
      const queryData = {
        postId,
        isDeleted: false,
      };

      const query = createQuery(queryComments, { ...queryData, page: currentPage });

      runQuery(query, mergeComments);
    } catch (e) {
      const errorText = handleError(e);

      setError(errorText);
    } finally {
      setLoading(false);
    }
  };

  useEffect(
    () =>
      observeComments(postId, {
        onEvent: (action, post) => {
          // console.log('comments', action, post);
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
          } else {
            setComments(prevState => {
              return { ...prevState, [post.localId]: post };
            });
          }
        },
      }),
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

      {/* {isLoadingOrEmpty ? (
        <View style={styles.isLoadingOrEmpty}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <HelperText type="info" style={styles.helperText}>
              No Comments, write the first!
            </HelperText>
          )}
        </View>
      ) : (
        data.map(comment => (
          <Comment
            postId={postId}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...comment}
            // onRefresh={() => {
            //   onQueryComment();
            // }}
            onEdit={setIsEdit}
            onReply={setIsReply}
            key={comment.commentId}
            selectedComment={isEdit}
          />
        )) */}
      {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Comments;
