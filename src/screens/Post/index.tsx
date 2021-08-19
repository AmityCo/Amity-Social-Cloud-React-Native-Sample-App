/* eslint-disable consistent-return */
import { StyleSheet, Alert } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getPost, observeUser } from '@amityco/ts-sdk';
import React, { VFC, useLayoutEffect, useState, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Header, PostItem, AddPost, Comments } from 'components';

import { t } from 'i18n';
import handleError from 'utils/handleError';

const PostScreen: VFC = () => {
  const [isEditId, setIsEditId] = useState('');
  const [post, setPost] = useState<Amity.Post>();
  const [user, setUser] = useState<Amity.User | undefined>();

  const route = useRoute();
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user?.data?.displayName ? `${user?.data?.displayName}'s Post` : 'Post',
      header: ({ scene, previous, navigation: nav }: StackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.data]);

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
