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
  createQuery,
  runQuery,
} from '@amityco/ts-sdk';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import handleError from 'utils/handleError';

import { ReactionsType } from 'types';
import CommentItem from './CommentItem';

import HeaderMenu from '../HeaderMenu';

type CommentProps = Amity.Comment & {
  postId?: string;
  selectedComment?: string;
  onReply?: (commentId: string) => void;
  onEdit: (commentId: string) => void;
};

const QUERY_LIMIT = 10;

const Comment: VFC<CommentProps> = ({
  postId,
  commentId,
  createdAt,
  data,
  hasFlag,
  myReactions,
  userId,
  onEdit,
  onReply,
  selectedComment,
  children,
  reactions,
}) => {
  const [user, setUser] = useState<Amity.User>();
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedChild, setSelectedChild] = useState('');
  const [isQueryingComments, setIsQueryingComments] = useState(false);

  const [pages, setPages] = useState<Amity.Pages>();
  const [comments, setComments] = useState<Record<string, Amity.Comment>>({});
  const [currentPage, setCurrentPage] = useState<Amity.Page>({ before: 0, limit: QUERY_LIMIT });

  const {
    colors: { text: textColor, primary: primaryColor, background: backgroundColor },
  } = useTheme();
  const { client } = useAuth();

  useEffect(() => {
    return observeUser(userId, ({ data: updatedUser }) => {
      setUser(updatedUser);
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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

  const mergeComments = ([newComments, newPages]: Amity.Paged<Record<string, Amity.Comment>>) => {
    setComments(prevComments => ({ ...prevComments, ...newComments }));

    setPages(newPages);
  };

  const onQueryComments = async () => {
    try {
      const queryData = {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        postId: postId!,
        isDeleted: false,
        parentId: commentId,
      };

      const query = createQuery(queryComments, { ...queryData, page: currentPage });

      runQuery(query, mergeComments);
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

  const dataComments = Object.values(comments);
  const isUser = client.userId === userId;
  const canEdit = isUser && onEdit ? onEditComment : undefined;
  const canDelete = isUser ? onDelete : undefined;

  return (
    <CommentItem postId={postId} />
    // <Card style={[!postId && { backgroundColor }, !postId && styles.childComment]}>
    //   <Card.Title
    //     subtitle={commentCreateAt}
    //     title={user?.displayName}
    //     right={({ size }) => (
    //       <HeaderMenu
    //         key={commentId}
    //         onEdit={canEdit}
    //         size={size / 1.5}
    //         hasFlag={hasFlag}
    //         visible={openMenu}
    //         onDelete={canDelete}
    //         onToggleMenu={() => setOpenMenu(prev => !prev)}
    //       >
    //         {postId && (
    //           <Pressable style={styles.icon} onPress={onReplyComment}>
    //             <Ionicons name="arrow-undo-outline" size={20} />
    //           </Pressable>
    //         )}
    //         <Pressable style={styles.icon} onPress={() => toggleReaction(ReactionsType.LIKE)}>
    //           <MaterialCommunityIcons
    //             size={20}
    //             color={myReactions?.includes(ReactionsType.LIKE) ? primaryColor : textColor}
    //             name={myReactions?.includes(ReactionsType.LIKE) ? 'thumb-up' : 'thumb-up-outline'}
    //           />
    //           {reactions[ReactionsType.LIKE] > 0 && <Text>{reactions[ReactionsType.LIKE]}</Text>}
    //         </Pressable>
    //         <Pressable style={styles.icon} onPress={() => toggleReaction(ReactionsType.LOVE)}>
    //           <MaterialCommunityIcons
    //             size={20}
    //             name={myReactions?.includes(ReactionsType.LOVE) ? 'heart' : 'heart-outline'}
    //             color={myReactions?.includes(ReactionsType.LOVE) ? primaryColor : textColor}
    //           />
    //           {reactions[ReactionsType.LOVE] > 0 && <Text>{reactions[ReactionsType.LOVE]}</Text>}
    //         </Pressable>
    //       </HeaderMenu>
    //     )}
    //   />
    //   <Card.Content>
    //     <Paragraph style={styles.text}>{data.text}</Paragraph>
    //   </Card.Content>

    //   {comments.length > 0 && (
    //     <View style={styles.comments}>
    //       {dataComments.map(cm => (
    //         <Comment
    //           // eslint-disable-next-line react/jsx-props-no-spreading
    //           {...cm}
    //           key={`${cm.commentId}_${cm.updatedAt}`}
    //           onEdit={childrenId => {
    //             onEdit(childrenId);
    //             setSelectedChild(childrenId);
    //           }}
    //         />
    //       ))}
    //     </View>
    //   )}
    // </Card>
  );
};

const styles = StyleSheet.create({
  text: { marginBottom: 10 },
  icon: { marginEnd: 15, flexDirection: 'row' },
  comments: { paddingStart: 30 },
  childComment: { marginBottom: 5 },
});

export default Comment;
