/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Moment from 'moment';
import React, { VFC, useState, useEffect } from 'react';
import { StyleSheet, Alert, Pressable } from 'react-native';
import { Card, Paragraph, useTheme, Text } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  observeUser,
  deleteComment,
  removeReaction,
  addReaction,
  observeComment,
  observeComments,
  queryComments,
  getComment,
  createQuery,
  runQuery,
} from '@amityco/ts-sdk';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import handleError from 'utils/handleError';

import { ReactionsType, CommentProps } from 'types';

import HeaderMenu from '../HeaderMenu';

const QUERY_LIMIT = 10;

const CommentItem: VFC<CommentProps> = ({
  postId,
  commentId,
  createdAt,
  data,
  hasFlag,
  myReactions,
  userId,
  onEdit,
  onReply,
  children,
  parentId,
  reactions,
}) => {
  const [user, setUser] = useState<Amity.User>();
  const [openMenu, setOpenMenu] = useState(false);
  const [comment, setComment] = useState<Amity.Comment>();
  const [comments, setComments] = useState<Record<string, Amity.Comment>>({});

  const {
    colors: { text: textColor, primary: primaryColor, background: backgroundColor },
  } = useTheme();
  const { client } = useAuth();

  useEffect(() => {
    observeUser(userId, setUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getCurrentComment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const getCurrentComment = async () => {
    try {
      const currentComment = await getComment(commentId);

      setComment(currentComment);
    } catch (error) {
      const errorText = handleError(error);
      Alert.alert('Oooops!', errorText, [{ text: t('close') }], { cancelable: false });
    }
  };

  // TODO this doesn't work
  useEffect(
    () => {
      observeComment(commentId, updatedComment => {
        setComment(updatedComment.data);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // useEffect(
  //   () =>
  //     observeComments(postId!, {
  //       onEvent: (action, post) => {
  //         console.log('comment', { action, post });
  //         // if (action === 'onDelete') {
  //         //   setPosts(prevState => {
  //         //     // eslint-disable-next-line no-param-reassign
  //         //     const state = { ...prevState };

  //         //     delete state[post.localId];
  //         //     return state;
  //         //   });
  //         // } else if (action === 'onCreate') {
  //         //   setPosts(prevState => {
  //         //     return { [post.localId]: post, ...prevState };
  //         //   });

  //         //   flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  //         // } else {
  //         //   setPosts(prevState => {
  //         //     return { ...prevState, [post.localId]: post };
  //         //   });
  //         // }
  //       },
  //     }),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [],
  // );

  useEffect(() => {
    if (postId) {
      onQueryComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentId]);

  const onQueryComments = async () => {
    try {
      const queryData = {
        postId: postId!,
        isDeleted: false,
        parentId: commentId,
      };

      const query = createQuery(queryComments, {
        ...queryData,
        page: { before: 0, limit: QUERY_LIMIT },
      });

      runQuery(query, result => {
        if (!result.data) return;
        const { data: childrenData } = result;

        setComments(prevComments => ({ ...prevComments, ...childrenData }));
      });
    } catch (e) {
      // const errorText = handleError(e);
    }
  };

  const toggleReaction = async (type: ReactionsType) => {
    console.log('toggle', { comment });
    try {
      const api = comment?.myReactions?.includes(type) ? removeReaction : addReaction;
      const query = createQuery(api, 'comment', commentId, type);
      runQuery(query);
    } catch (e) {
      console.log(e);
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

  const commentCreateAt = Moment(comment?.createdAt ?? createdAt).format('HH:mm, MMM d');

  const isUser = client.userId === userId;
  const canEdit = isUser && onEdit ? onEditComment : undefined;
  const canDelete = isUser ? onDelete : undefined;

  const commentsData = Object.values(comments).map(cm => cm);

  return (
    <Card style={[!!parentId && { backgroundColor }, !!parentId && styles.childComment]}>
      <Card.Title
        subtitle={commentCreateAt}
        title={user?.displayName}
        right={({ size }) => (
          <HeaderMenu
            key={commentId}
            onEdit={canEdit}
            size={size / 1.5}
            visible={openMenu}
            onDelete={canDelete}
            hasFlag={comment?.flagCount > 0}
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
              {reactions[ReactionsType.LIKE] > 0 && <Text>{reactions[ReactionsType.LIKE]}</Text>}
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
              {reactions[ReactionsType.LOVE] > 0 && <Text>{reactions[ReactionsType.LOVE]}</Text>}
            </Pressable>
          </HeaderMenu>
        )}
      />
      <Card.Content>
        <Paragraph style={styles.text}>{comment?.data.text ?? data.text}</Paragraph>
      </Card.Content>
      {commentsData.length > 0 &&
        commentsData.map(cm => (
          <CommentItem
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...cm}
            onEdit={onEdit}
            onReply={onReply}
            key={cm.commentId}
          />
        ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  text: { marginBottom: 10 },
  icon: { marginEnd: 15, flexDirection: 'row' },
  childComment: { marginBottom: 5, marginStart: 20 },
});

export default CommentItem;
