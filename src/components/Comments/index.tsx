import { StyleSheet, View } from 'react-native';
import { queryComments } from '@amityco/ts-sdk';
import React, { VFC, useState, useEffect } from 'react';
import { HelperText, ActivityIndicator } from 'react-native-paper';

import Comment from './Comment';
import AddComment from './AddComment';

type CommentsType = Pick<ASC.Post, 'postId'> & {
  onRefresh: () => void;
};

const Comments: VFC<CommentsType> = ({ postId, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<ASC.Comment[]>([]);
  const [isEditCommentId, setIsEditCommentId] = useState('');

  useEffect(() => {
    setIsLoading(true);

    onQueryComment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onQueryComment = async () => {
    try {
      const query = {
        postId,
        isDeleted: false,
      };

      const queryComment = await queryComments(query);

      setComments(queryComment);
    } catch {
      // const errorText = handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoadingOrEmpty = isLoading || (!isLoading && !comments.length);

  return (
    <View>
      <AddComment
        postId={postId}
        onRefresh={() => {
          onQueryComment();
          setIsEditCommentId('');
        }}
        onCancel={() => {
          setIsEditCommentId('');
        }}
        isEditCommentId={isEditCommentId}
      />

      {isLoadingOrEmpty ? (
        <View style={styles.isLoadingOrEmpty}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <HelperText type="info" style={styles.helperText}>
              No Comments, write the first!
            </HelperText>
          )}
        </View>
      ) : (
        comments.map(comment => (
          <Comment
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...comment}
            onRefresh={() => {
              onQueryComment();
              onRefresh();
            }}
            key={comment.commentId}
            onEditComment={setIsEditCommentId}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  isLoadingOrEmpty: { padding: 20 },
  helperText: { textAlign: 'center', padding: 20, marginTop: 20 },
});

export default Comments;
