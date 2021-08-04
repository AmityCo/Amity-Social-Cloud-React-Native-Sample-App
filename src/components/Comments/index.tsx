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
  const [isEdit, setIsEdit] = useState('');
  const [isReply, setIsReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<ASC.Comment[]>([]);

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

  const parent = comments.find(cm => cm.commentId === isReply);
  const isLoadingOrEmpty = isLoading || (!isLoading && !comments.length);

  return (
    <View>
      <AddComment
        postId={postId}
        onRefresh={() => {
          onQueryComment();
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
            postId={postId}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...comment}
            onRefresh={() => {
              onQueryComment();
              onRefresh();
            }}
            onEdit={setIsEdit}
            onReply={setIsReply}
            key={comment.commentId}
            selectedComment={isEdit}
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
