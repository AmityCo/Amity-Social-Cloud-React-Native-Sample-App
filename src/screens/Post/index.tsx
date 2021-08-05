import { StyleSheet, Alert } from 'react-native';
import { getPost, observeUser } from '@amityco/ts-sdk';
import { StackHeaderProps } from '@react-navigation/stack';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import React, { VFC, useLayoutEffect, useState, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Header, PostItem, AddPost, Comments } from 'components';

import { t } from 'i18n';
import handleError from 'utils/handleError';

import { PostProps, PostItemProps } from 'types';

const PostScreen: VFC = () => {
  const [post, setPost] = useState<ASC.Post>();
  const [user, setUser] = useState<ASC.User>();
  const [isEditId, setIsEditId] = useState('');

  const route = useRoute();
  const navigation = useNavigation();
  const {
    colors: { surface: surfaceColor },
  } = useTheme();

  const { postId, postedUserId, onRefresh } = route.params as PostProps & { onRefresh: () => void };

  useEffect(() => {
    if (postedUserId) {
      observeUser(postedUserId, setUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      headerTitle: user?.displayName ? `${user?.displayName}'s Post` : 'Post',
      header: ({ scene, previous, navigation: nav }: StackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.displayName]);

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
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(post as PostItemProps)}
            onEditPost={() => {
              setIsEditId(postId);
            }}
            onRefresh={() => {
              getCurrentPost();

              onRefresh();
            }}
          />

          <Comments postId={postId} onRefresh={onRefresh} />

          <AddPost
            onClose={() => {
              setIsEditId('');
            }}
            isEditId={isEditId}
            onAddPost={() => {
              onRefresh();
              getCurrentPost();
            }}
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
