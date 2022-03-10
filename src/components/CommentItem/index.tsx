import { format } from 'date-fns';
import { Pressable } from 'react-native';
import React, { VFC, useState, useEffect } from 'react';
import { Card, Paragraph, useTheme, Text } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  observeUser,
  deleteComment,
  removeReaction,
  addReaction,
  observeComment,
  createQuery,
  runQuery,
} from '@amityco/ts-sdk';

import useAuth from 'hooks/useAuth';
import { alertError, alertConfirmation } from 'utils/alerts';

import { ReactionsType } from 'types';

import HeaderMenu from '../HeaderMenu';

import styles from './styles';

export type CommentProps = Amity.Comment & {
  postId: string;
  selectedComment?: string;
  onPress?: () => void;
  onReply?: (commentId: string) => void;
  onEdit?: (commentId: string) => void;
};

const CommentItem: VFC<CommentProps> = ({
  commentId,
  createdAt,
  data,
  userId,
  onEdit,
  onReply,
  onPress,
  parentId,
  reactions,
}) => {
  const [user, setUser] = useState<Amity.User>();
  const [openMenu, setOpenMenu] = useState(false);
  const [comment, setComment] = useState<Amity.Comment>();

  const {
    colors: { text: textColor, primary: primaryColor, background: backgroundColor },
  } = useTheme();
  const { client } = useAuth();

  useEffect(() => {
    return observeUser(userId, ({ data: updatedUser }) => {
      setUser(updatedUser);
    });
  }, [userId]);

  useEffect(() => {
    return observeComment(commentId, ({ data: commentData }) => {
      setComment(commentData);
    });
  }, [commentId]);

  const toggleReaction = async (type: ReactionsType) => {
    const api = comment?.myReactions?.includes(type) ? removeReaction : addReaction;
    const query = createQuery(api, 'comment', commentId, type);

    runQuery(query);
  };

  const onEditComment = () => {
    setOpenMenu(false);
    onEdit && onEdit(commentId);
  };

  const onDelete = () => {
    alertConfirmation(() => {
      setOpenMenu(false);

      runQuery(createQuery(deleteComment, commentId, true), ({ error }) => {
        if (error) {
          alertError(error);
        }
      });
    });
  };

  const onReplyComment = () => {
    if (onReply) {
      onReply(commentId);
    }
  };

  const commentCreateAt = format(new Date(comment?.createdAt ?? createdAt), 'HH:mm, MMM d');

  const isUser = client.userId === userId;
  const canEdit = isUser && onEdit ? onEditComment : undefined;
  const canDelete = isUser ? onDelete : undefined;

  return (
    <Card
      style={[!!parentId && { backgroundColor }, !!parentId && styles.childComment]}
      onPress={onPress && onPress}
    >
      <Card.Title
        subtitle={commentCreateAt}
        title={user?.displayName}
        right={({ size }) => (
          <HeaderMenu
            key={commentId}
            size={size / 1.5}
            visible={openMenu}
            hasFlag={(comment?.flagCount ?? 0) > 0}
            onEdit={canEdit}
            onDelete={canDelete}
            onToggleMenu={() => setOpenMenu(prev => !prev)}
          >
            {!parentId && (
              <Pressable style={styles.icon} onPress={onReplyComment}>
                <Ionicons name="arrow-undo-outline" size={20} color={primaryColor} />
              </Pressable>
            )}
            <Pressable style={styles.icon} onPress={() => toggleReaction(ReactionsType.LIKE)}>
              <MaterialCommunityIcons
                size={20}
                color={
                  comment?.myReactions?.includes(ReactionsType.LIKE) ? primaryColor : textColor
                }
                name={
                  comment?.myReactions?.includes(ReactionsType.LIKE)
                    ? 'thumb-up'
                    : 'thumb-up-outline'
                }
              />
              {(comment?.reactions ?? reactions)[ReactionsType.LIKE] > 0 && (
                <Text>{(comment?.reactions ?? reactions)[ReactionsType.LIKE]}</Text>
              )}
            </Pressable>
            <Pressable style={styles.icon} onPress={() => toggleReaction(ReactionsType.LOVE)}>
              <MaterialCommunityIcons
                size={20}
                name={
                  comment?.myReactions?.includes(ReactionsType.LOVE) ? 'heart' : 'heart-outline'
                }
                color={
                  comment?.myReactions?.includes(ReactionsType.LOVE) ? primaryColor : textColor
                }
              />
              {(comment?.reactions ?? reactions)[ReactionsType.LOVE] > 0 && (
                <Text>{(comment?.reactions ?? reactions)[ReactionsType.LOVE]}</Text>
              )}
            </Pressable>
          </HeaderMenu>
        )}
      />
      <Card.Content>
        <Paragraph style={styles.text}>{comment?.data.text ?? data.text}</Paragraph>
      </Card.Content>
    </Card>
  );
};

export default CommentItem;
