import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getPost, observeUser, runQuery, createQuery } from '@amityco/ts-sdk';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { VFC, useLayoutEffect, useState, useEffect, useCallback } from 'react';

import { Header, PostItem, AddPost, Comments } from 'components';

import useAuth from 'hooks/useAuth';
import { alertError } from 'utils/alerts';

import { DrawerStackHeaderProps } from 'types';

import styles from './styles';

const PostScreen: VFC = () => {
  const [isEditId, setIsEditId] = useState('');
  const [post, setPost] = useState<Amity.Post>();
  const [user, setUser] = useState<Amity.User | undefined>();

  const route = useRoute();
  const { client } = useAuth();
  const navigation = useNavigation();
  const {
    colors: { surface: surfaceColor },
  } = useTheme();

  const {
    post: { postId, postedUserId },
  } = route.params as { post: Amity.Post };

  useEffect(() => {
    return observeUser(postedUserId, ({ data: updatedUser }) => {
      setUser(updatedUser);
    });
  }, [postedUserId]);

  const getCurrentPost = useCallback(async () => {
    runQuery(createQuery(getPost, postId), ({ data, error }) => {
      if (data) {
        if (data.isDeleted) {
          navigation.goBack();
        } else {
          setPost(data);
        }
      } else if (error) {
        alertError(error, () => {
          navigation.goBack();
        });
      }
    });
  }, [navigation, postId]);

  useEffect(() => {
    getCurrentPost();
  }, [getCurrentPost, postId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user?.data?.displayName ? `${user.data.displayName}'s Post` : 'Post',
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
  }, [navigation, user]);

  const onCloseAddPost = useCallback(() => {
    setIsEditId('');
  }, []);

  const onEditPost = useCallback(() => {
    setIsEditId(postId);
  }, [postId]);

  const targetId = client.userId ?? '';

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: surfaceColor }}
    >
      {!post?.postId ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <>
          <PostItem post={post} onEditPost={onEditPost} />

          <Comments postId={postId} />

          {isEditId !== '' && (
            <AddPost
              onClose={onCloseAddPost}
              isEditId={isEditId}
              targetType="user"
              targetId={targetId}
            />
          )}
        </>
      )}
    </KeyboardAwareScrollView>
  );
};

export default PostScreen;
