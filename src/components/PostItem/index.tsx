import Moment from 'moment';
import React, { VFC, useState, useEffect } from 'react';
import { Image, StyleSheet, Alert, View } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Caption, Card, useTheme, Paragraph, Button } from 'react-native-paper';
import {
  observeUser,
  observeFile,
  getPost,
  addReaction,
  removeReaction,
  deletePost,
} from '@amityco/ts-sdk';

import { t } from 'i18n';
import handleError from 'utils/handleError';

import { PostProps, ReactionsType } from 'types';

import HeaderMenu from '../HeaderMenu';

type PostItemProps = PostProps & { onRefresh: () => void; onEditPost: (postId: string) => void };

const PostItem: VFC<PostItemProps> = ({
  data,
  postId,
  onPress,
  postedUserId,
  commentsCount,
  createdAt,
  children,
  myReactions,
  onRefresh,
  hasFlag,
  onEditPost,
  // ...args
}) => {
  const [user, setUser] = useState<ASC.User>();
  const [file, setFile] = useState<ASC.File>();
  const [openMenu, setOpenMenu] = useState(false);
  const [postImage, setPostImage] = useState<ASC.File>();
  const [childPost, setChildPost] = useState<ASC.Post[]>([]);

  const {
    colors: { text: textColor, primary: primaryColor },
  } = useTheme();

  useEffect(() => {
    if (postedUserId) {
      observeUser(postedUserId, setUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.avatarFileId) {
      observeFile(user.avatarFileId, setFile);
    }
  }, [user]);

  useEffect(() => {
    if (childPost[0]) {
      observeFile(childPost[0].data?.fileId, setPostImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childPost.length]);

  useEffect(() => {
    fetchChildredPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchChildredPost = async () => {
    if (children && children.length > 0) {
      const childrenPost = await getPost(children[0]);

      setChildPost([childrenPost]);
    }
  };

  const toggleReaction = async (type: ReactionsType) => {
    try {
      const api = myReactions?.includes(type) ? removeReaction : addReaction;

      await api('post', postId, type);

      onRefresh();
    } catch (e) {
      // TODO toastbar
    }
  };

  // TODO
  const onEdit = () => {
    setOpenMenu(false);

    onEditPost(postId);
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

  // // TODO
  // const onFlag = () => {
  //   Alert.alert('soon :)');
  // };

  // // TODO
  // const onUnflag = () => {
  //   Alert.alert('soon :)');
  // };

  const postCreateAt = Moment(createdAt).format('HH:mm, MMM d');

  return (
    <Card onPress={onPress}>
      <Card.Title
        right={({ size }) => (
          <HeaderMenu
            size={size}
            onEdit={onEdit}
            onDelete={onDelete}
            // onFlag={onFlag}
            // onUnflag={onUnflag}
            hasFlag={hasFlag}
            visible={openMenu}
            onToggleMenu={() => setOpenMenu(prev => !prev)}
          />
        )}
        subtitle={postCreateAt}
        title={user?.displayName}
        left={
          file?.fileUrl
            ? () => <Image source={{ uri: file?.fileUrl }} style={styles.avatar} />
            : undefined
        }
      />

      <Card.Content>
        <Paragraph style={styles.text}>{data.text}</Paragraph>
        {postImage?.fileUrl && <Card.Cover source={{ uri: postImage?.fileUrl }} />}
      </Card.Content>

      <Card.Actions style={styles.footer}>
        <View style={styles.footerLeft}>
          <Button onPress={() => toggleReaction(ReactionsType.LIKE)}>
            <MaterialCommunityIcons
              size={20}
              color={myReactions?.includes(ReactionsType.LIKE) ? primaryColor : textColor}
              name={myReactions?.includes(ReactionsType.LIKE) ? 'thumb-up' : 'thumb-up-outline'}
            />
          </Button>
          <Button onPress={() => toggleReaction(ReactionsType.LOVE)}>
            <MaterialCommunityIcons
              size={20}
              name={myReactions?.includes(ReactionsType.LOVE) ? 'heart' : 'heart-outline'}
              color={myReactions?.includes(ReactionsType.LOVE) ? primaryColor : textColor}
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
