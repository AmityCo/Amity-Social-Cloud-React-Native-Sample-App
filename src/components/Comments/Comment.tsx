import Moment from 'moment';
import React, { VFC, useState, useEffect } from 'react';
import { StyleSheet, Alert, Pressable, View } from 'react-native';
import { Card, Paragraph, useTheme, Text } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  observeUser,
  deleteComment,
  removeReaction,
  addReaction,
  queryComments,
} from '@amityco/ts-sdk';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import handleError from 'utils/handleError';

import { ReactionsType } from 'types';

import HeaderMenu from '../HeaderMenu';

type CommentProps = ASC.Comment & {
  postId?: string;
  onRefresh: () => void;
  selectedComment?: string;
  onReply?: (commentId: string) => void;
  onEdit: (commentId: string) => void;
};

const Comment: VFC<CommentProps> = ({
  postId,
  commentId,
  createdAt,
  data,
  hasFlag,
  myReactions,
  userId,
  onRefresh,
  onEdit,
  onReply,
  selectedComment,
  children,
  reactions,
}) => {
  const [user, setUser] = useState<ASC.User>();
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedChild, setSelectedChild] = useState('');
  const [comments, setComments] = useState<ASC.Comment[]>([]);
  const [isQueryingComments, setIsQueryingComments] = useState(false);

  const {
    colors: { text: textColor, primary: primaryColor, background: backgroundColor },
  } = useTheme();
  const { client } = useAuth();

  useEffect(() => {
    observeUser(userId, setUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedComment === '' && children.includes(selectedChild)) {
      onQueryComments();
      setSelectedChild('');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComment]);

  useEffect(() => {
    if (!isQueryingComments && postId && children.length > 0) {
      onQueryComments();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children.length]);

  const onQueryComments = async () => {
    try {
      const query = {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        postId: postId!,
        isDeleted: false,
        parentId: commentId,
      };

      const result = await queryComments(query);

      setComments(result);
    } catch (e) {
      // const errorText = handleError(error);
    } finally {
      setIsQueryingComments(false);
    }
  };

  const toggleReaction = async (type: ReactionsType) => {
    try {
      const api = myReactions?.includes(type) ? removeReaction : addReaction;

      await api('comment', commentId, type);

      onRefresh();
    } catch (e) {
      // TODO toastbar
    }
  };

  const onEditComment = () => {
    setOpenMenu(false);
    onEdit(commentId);
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

  const onReplyComment = () => {
    if (onReply) {
      onReply(commentId);
    }
  };

  const commentCreateAt = Moment(createdAt).format('HH:mm, MMM d');

  const isUser = client.userId === userId;
  const canEdit = isUser && onEdit ? onEditComment : undefined;
  const canDelete = isUser ? onDelete : undefined;

  return (
    <Card style={[!postId && { backgroundColor }, !postId && styles.childComment]}>
      <Card.Title
        subtitle={commentCreateAt}
        title={user?.displayName}
        right={({ size }) => (
          <HeaderMenu
            key={commentId}
            onEdit={canEdit}
            size={size / 1.5}
            hasFlag={hasFlag}
            visible={openMenu}
            onDelete={canDelete}
            onToggleMenu={() => setOpenMenu(prev => !prev)}
          >
            {postId && (
              <Pressable style={styles.icon} onPress={onReplyComment}>
                <Ionicons name="arrow-undo-outline" size={20} />
              </Pressable>
            )}
            <Pressable style={styles.icon} onPress={() => toggleReaction(ReactionsType.LIKE)}>
              <MaterialCommunityIcons
                size={20}
                color={myReactions?.includes(ReactionsType.LIKE) ? primaryColor : textColor}
                name={myReactions?.includes(ReactionsType.LIKE) ? 'thumb-up' : 'thumb-up-outline'}
              />
              {reactions[ReactionsType.LIKE] > 0 && <Text>{reactions[ReactionsType.LIKE]}</Text>}
            </Pressable>
            <Pressable style={styles.icon} onPress={() => toggleReaction(ReactionsType.LOVE)}>
              <MaterialCommunityIcons
                size={20}
                name={myReactions?.includes(ReactionsType.LOVE) ? 'heart' : 'heart-outline'}
                color={myReactions?.includes(ReactionsType.LOVE) ? primaryColor : textColor}
              />
              {reactions[ReactionsType.LOVE] > 0 && <Text>{reactions[ReactionsType.LOVE]}</Text>}
            </Pressable>
          </HeaderMenu>
        )}
      />
      <Card.Content>
        <Paragraph style={styles.text}>{data.text}</Paragraph>
      </Card.Content>

      {comments.length > 0 && (
        <View style={styles.comments}>
          {comments.map(cm => (
            <Comment
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...cm}
              key={`${cm.commentId}_${cm.updatedAt}`}
              onEdit={childrenId => {
                onEdit(childrenId);
                setSelectedChild(childrenId);
              }}
              onRefresh={() => {
                onRefresh();
                onQueryComments();
              }}
            />
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  text: { marginBottom: 10 },
  icon: { marginEnd: 15, flexDirection: 'row' },
  comments: { paddingStart: 30 },
  childComment: { marginBottom: 5 },
});

export default Comment;
