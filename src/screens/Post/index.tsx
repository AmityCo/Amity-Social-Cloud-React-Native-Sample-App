import Moment from 'moment';
import React, { VFC, useLayoutEffect, useState, useEffect } from 'react';
import { Image, StyleSheet, Alert, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, useTheme, Paragraph, Button } from 'react-native-paper';
import { StackHeaderProps } from '@react-navigation/stack';
import { useRoute, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  observeUser,
  observeFile,
  getPost,
  addReaction,
  removeReaction,
  deletePost,
} from '@amityco/ts-sdk';

import { Header, PostHeaderMenu, AddPost } from 'components';

import { t } from 'i18n';
import handleError from 'utils/handleError';

import { PostReactions, PostProps } from 'types';

import Comments from './Comments';
import AddComments from './AddComment';

const PostScreen: VFC = () => {
  const [post, setPost] = useState<ASC.Post>();
  const [user, setUser] = useState<ASC.User>();
  const [file, setFile] = useState<ASC.File>();
  const [isEditId, setIsEditId] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [postImage, setPostImage] = useState<ASC.File>();
  const [childPost, setChildPost] = useState<ASC.Post[]>([]);
  const [isEditCommentId, setIsEditCommentId] = useState('');
  const [onRefershComments, setOnRefershComments] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const {
    colors: { text: textColor, primary: primaryColor },
  } = useTheme();

  const {
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
    // ...args
  } = route.params as PostProps & { onRefresh: () => void };

  useEffect(() => {
    getCuurrentPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const getCuurrentPost = async () => {
    try {
      const currentPost = await getPost(postId);

      setPost(currentPost);
    } catch (error) {
      const errorText = handleError(error);
      Alert.alert(
        'Oooops!',
        errorText,
        [
          {
            text: t('close'),
            onPress: async () => {
              navigation.goBack();
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user?.displayName ? `${user?.displayName}'s Post` : 'Post',
      header: ({ scene, previous, navigation: nav }: StackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.displayName]);

  const toggleReaction = async (type: PostReactions) => {
    try {
      const api = myReactions?.includes(type) ? addReaction : removeReaction;

      await api('post', postId, type);
      onRefresh();
    } catch (e) {
      // TODO toastbar
    }
  };

  // TODO
  const onEdit = () => {
    setOpenMenu(false);

    setIsEditId(postId);
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

              setTimeout(() => {
                navigation.goBack();
              }, 300);
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

  // TODO
  // const onFlag = () => {
  //   Alert.alert('soon :)');
  // };

  // // TODO
  // const onUnflag = () => {
  //   Alert.alert('soon :)');
  // };

  const postCreateAt = Moment(createdAt).format('HH:mm, MMM d');

  return (
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
      <Card onPress={onPress}>
        <Card.Title
          right={({ size }) => (
            <PostHeaderMenu
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
          <Paragraph style={styles.text}>{post?.data.text ?? data.text}</Paragraph>
          {postImage?.fileUrl && <Card.Cover source={{ uri: postImage?.fileUrl }} />}
        </Card.Content>
        <Card.Actions style={styles.footer}>
          <View style={styles.footerLeft}>
            <Button onPress={() => toggleReaction(PostReactions.LIKE)}>
              <MaterialCommunityIcons
                size={20}
                color={myReactions?.includes(PostReactions.LIKE) ? primaryColor : textColor}
                name={myReactions?.includes(PostReactions.LIKE) ? 'thumb-up' : 'thumb-up-outline'}
              />
            </Button>
            <Button onPress={() => toggleReaction(PostReactions.LOVE)}>
              <MaterialCommunityIcons
                size={20}
                name={myReactions?.includes(PostReactions.LOVE) ? 'heart' : 'heart-outline'}
                color={myReactions?.includes(PostReactions.LOVE) ? primaryColor : textColor}
              />
            </Button>
          </View>
        </Card.Actions>

        <AddComments
          postId={postId}
          onRefresh={() => {
            setIsEditCommentId('');
            setOnRefershComments(prev => !prev);
          }}
          onCancel={() => {
            setIsEditCommentId('');
          }}
          isEditCommentId={isEditCommentId}
        />
      </Card>

      <Comments
        postId={postId}
        onRefreshed={onRefershComments}
        onRefresh={onRefresh}
        onEditComment={setIsEditCommentId}
      />

      <AddPost
        onClose={() => {
          setIsEditId('');
        }}
        isEditId={isEditId}
        onAddPost={() => {
          onRefresh();
          getCuurrentPost();
        }}
        visible={isEditId !== ''}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 18,
    marginRight: 16,
  },
  text: { marginBottom: 10 },
  footer: { justifyContent: 'space-between' },
  footerLeft: { flexDirection: 'row' },
});

export default PostScreen;
