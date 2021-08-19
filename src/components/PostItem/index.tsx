/* eslint-disable consistent-return */
import Moment from 'moment';
import React, { VFC, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Alert, View } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Caption, Card, useTheme, Paragraph, Button, Text } from 'react-native-paper';
import {
  observeUser,
  observeFile,
  getPost,
  addReaction,
  removeReaction,
  deletePost,
  fileUrlWithSize,
  runQuery,
  createQuery,
  isReportedByMe,
  createReport,
  deleteReport,
  observePost,
} from '@amityco/ts-sdk';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import handleError from 'utils/handleError';

import { ReactionsType, PostItemProps } from 'types';

import CardTitle from '../CardTitle';
import HeaderMenu from '../HeaderMenu';

const PostItem: VFC<{ post: Amity.Post } & PostItemProps> = ({
  post: postProp,
  onEditPost,
  onPress,
}) => {
  const [user, setUser] = useState<Amity.User>();
  const [file, setFile] = useState<Amity.File>();
  const [openMenu, setOpenMenu] = useState(false);
  const [flaggedByMe, setFlaggedByMe] = useState(false);
  const [postImage, setPostImage] = useState<Amity.File>();
  const [childPost, setChildPost] = useState<Amity.Post[]>([]);
  const [postResult, setPostResult] = useState<Amity.QueryResult<Amity.Post | undefined>>({
    data: postProp,
  });

  const { data: post } = postResult;

  const { client } = useAuth();
  const navigation = useNavigation();
  const {
    colors: { text: textColor, primary: primaryColor },
  } = useTheme();

  const {
    data,
    postId,
    postedUserId,
    commentsCount,
    createdAt,
    myReactions,
    reactions,
    children,
    flagCount,
    isDeleted,
  } = post;

  const checkIsReportedByMe = async () => {
    runQuery(createQuery(isReportedByMe, 'post', postId), result => {
      setFlaggedByMe(!!result.data);
    });
  };

  useEffect(
    () => {
      return observePost(postId, updatedPost => {
        checkIsReportedByMe();
        setPostResult(updatedPost);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [postId],
  );

  useEffect(() => {
    return observeUser(postedUserId, ({ data: updatedUser }) => {
      setUser(updatedUser);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postedUserId]);

  useEffect(() => {
    if (user?.avatarFileId) {
      return observeFile(user.avatarFileId, fileObj => setFile(fileObj.data));
    }
  }, [user]);

  useEffect(() => {
    if (childPost[0]) {
      return observeFile(childPost[0].data?.fileId, imgObj => setPostImage(imgObj.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childPost?.length]);

  useEffect(() => {
    fetchChildredPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children?.length]);

  const fetchChildredPost = async () => {
    if (children && children?.length > 0) {
      const childrenPost = await getPost(children[0]);

      setChildPost([childrenPost]);
    }
  };

  const toggleReaction = async (type: ReactionsType) => {
    try {
      const api = myReactions?.includes(type) ? removeReaction : addReaction;
      const query = createQuery(api, 'post', postId, type);

      runQuery(query);
    } catch (e) {
      // TODO toastbar
    }
  };

  const toggleFlag = async () => {
    try {
      const api = flaggedByMe ? deleteReport : createReport;
      const query = createQuery(api, 'post', postId);

      runQuery(query);
    } catch (e) {
      // TODO toastbar
    }
  };

  const onEdit = () => {
    setOpenMenu(false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    onEditPost!(postId);
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

              await deletePost(postId);

              if (!onPress) {
                navigation.goBack();
              }
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

  const postCreateAt = Moment(createdAt).format('HH:mm, MMM d');

  const isUser = client.userId === postedUserId;
  const canEdit = isUser && onEditPost ? onEdit : undefined;
  const canDelete = isUser ? onDelete : undefined;

  return (
    <Card onPress={onPress}>
      <Card.Title
        right={({ size }) => (
          <HeaderMenu
            size={size}
            onEdit={canEdit}
            visible={openMenu}
            onDelete={canDelete}
            onToggleMenu={() => setOpenMenu(prev => !prev)}
          />
        )}
        subtitle={postCreateAt}
        title={<CardTitle title={user?.displayName} flagCount={flagCount} isDeleted={isDeleted} />}
        left={
          file?.fileUrl
            ? () => <Image style={styles.avatar} source={{ uri: file?.fileUrl }} />
            : undefined
        }
      />

      <Card.Content>
        <Paragraph style={styles.text}>{data.text}</Paragraph>
        {postImage?.fileUrl && postImage?.type === 'image' && (
          <Card.Cover source={{ uri: fileUrlWithSize(postImage?.fileUrl, 'medium') }} />
        )}
      </Card.Content>

      <Card.Actions style={styles.footer}>
        <View style={styles.footerLeft}>
          <Button onPress={() => toggleReaction(ReactionsType.LIKE)}>
            <MaterialCommunityIcons
              size={20}
              color={myReactions?.includes(ReactionsType.LIKE) ? primaryColor : textColor}
              name={myReactions?.includes(ReactionsType.LIKE) ? 'thumb-up' : 'thumb-up-outline'}
            />
            {reactions[ReactionsType.LIKE] > 0 && <Text>{reactions[ReactionsType.LIKE]}</Text>}
          </Button>
          <Button onPress={() => toggleReaction(ReactionsType.LOVE)}>
            <MaterialCommunityIcons
              size={20}
              name={myReactions?.includes(ReactionsType.LOVE) ? 'heart' : 'heart-outline'}
              color={myReactions?.includes(ReactionsType.LOVE) ? primaryColor : textColor}
            />
            {reactions[ReactionsType.LOVE] > 0 && <Text>{reactions[ReactionsType.LOVE]}</Text>}
          </Button>
          <Button onPress={toggleFlag}>
            <MaterialCommunityIcons
              size={20}
              name={flaggedByMe ? 'flag' : 'flag-plus-outline'}
              color={flaggedByMe ? primaryColor : textColor}
            />
          </Button>
        </View>

        <View style={styles.footerRight}>
          <FontAwesome5
            name="comment"
            size={20}
            color={commentsCount === 0 ? textColor : primaryColor}
          />
          <Caption> {t('posts.commentsCount', { count: commentsCount })}</Caption>
        </View>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
    borderRadius: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 18,
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
  },
  ellipsis: { marginHorizontal: 10 },
  text: { marginBottom: 10 },
  footer: { justifyContent: 'space-between' },
  footerLeft: { flexDirection: 'row' },
  footerRight: { flexDirection: 'row', paddingEnd: 10 },
});

export default PostItem;
