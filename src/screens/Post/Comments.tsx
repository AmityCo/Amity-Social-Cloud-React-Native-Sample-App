import React, { VFC, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText, ActivityIndicator } from 'react-native-paper';
import { queryComments } from '@amityco/ts-sdk';

import Comment from './Comment';

type CommentsType = Pick<ASC.Post, 'postId'> & {
  onRefreshed: boolean;
  onRefresh: () => void;
  onEditComment: (commendId: string) => void;
};

const Comments: VFC<CommentsType> = ({ postId, onRefreshed, onRefresh, onEditComment }) => {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<ASC.Comment[]>([]);

  useEffect(() => {
    if (!init) {
      setInit(true);
      setIsLoading(true);
    }

    onQueryComment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefreshed]);

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
            onEditComment={onEditComment}
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
