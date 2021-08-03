import Moment from 'moment';
import React, { VFC, useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import { observeUser, deleteComment } from '@amityco/ts-sdk';

import { PostHeaderMenu } from 'components';

import { t } from 'i18n';
import handleError from 'utils/handleError';

type CommentProps = ASC.Comment & {
  onRefresh: () => void;
  onEditComment: (commentId: string) => void;
};

const Comment: VFC<CommentProps> = ({
  commentId,
  createdAt,
  data,
  hasFlag,
  myReactions,
  userId,
  onRefresh,
  onEditComment,
}) => {
  const [user, setUser] = useState<ASC.User>();
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    observeUser(userId, setUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEdit = () => {
    setOpenMenu(false);
    onEditComment(commentId);
  };

  const onDelete = () => {
    Alert.alert(
      t('are_you_sure'),
      '',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('ok'),
          onPress: async () => {
            try {
              setOpenMenu(false);

              await deleteComment(commentId);
              onRefresh();
            } catch (error) {
              const errorText = handleError(error);

              Alert.alert(errorText);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const commentCreateAt = Moment(createdAt).format('HH:mm, MMM d');

  return (
    <Card>
      <Card.Title
        subtitle={commentCreateAt}
        title={user?.displayName}
        right={({ size }) => (
          <PostHeaderMenu
            size={size / 1.5}
            onEdit={onEdit}
            onDelete={onDelete}
            hasFlag={hasFlag}
            visible={openMenu}
            onToggleMenu={() => setOpenMenu(prev => !prev)}
          />
        )}
      />
      <Card.Content>
        <Paragraph style={styles.text}>{data.text}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  text: { marginBottom: 10 },
});

export default Comment;
