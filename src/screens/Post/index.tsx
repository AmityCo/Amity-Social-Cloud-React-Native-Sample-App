/* eslint-disable consistent-return */
import { StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getPost, observeUser } from '@amityco/ts-sdk';
import React, { VFC, useLayoutEffect, useState, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Header, PostItem, AddPost, Comments } from 'components';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import getErrorMessage from 'utils/getErrorMessage';

import { DrawerStackHeaderProps } from 'types';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postedUserId]);

  useEffect(() => {
    getCurrentPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const getCurrentPost = async () => {
    try {
      const currentPost = await getPost(postId);

      if (currentPost.isDeleted) {
        navigation.goBack();
      } else {
        setPost(currentPost);
      }
    } catch (error) {
      const errorText = getErrorMessage(error);
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user?.data?.displayName ? `${user?.data?.displayName}'s Post` : 'Post',
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.data]);

  if (!client.userId) {
    throw Error('not connected!');
  }

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: surfaceColor }}
    >
      {!post?.postId ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <>
          <PostItem
            post={post}
            onEditPost={() => {
              setIsEditId(postId);
            }}
          />

          <Comments postId={postId} />

          <AddPost
            onClose={() => {
              setIsEditId('');
            }}
            isEditId={isEditId}
            targetType="user"
            targetId={client.userId}
            visible={isEditId !== ''}
          />
        </>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  loading: { marginTop: 20 },
});

export default PostScreen;
