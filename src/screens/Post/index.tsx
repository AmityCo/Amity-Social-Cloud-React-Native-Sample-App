import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// import { getPost, observeUser, runQuery, createQuery } from '@amityco/ts-sdk';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { VFC, useLayoutEffect, useState, useEffect, useCallback } from 'react';

import { Header, PostItem, AddPost } from 'components';

import useAuth from 'hooks/useAuth';
// import { alertError } from 'utils/alerts';

import { DrawerStackHeaderProps } from 'types';

import styles from './styles';

const PostScreen: VFC = () => {
  const [isEditId, setIsEditId] = useState('');
  const [post] = useState<Amity.Post>();
  // const [user, setUser] = useState<Amity.User | undefined>();

  // const route = useRoute();
  const { client } = useAuth();
  const navigation = useNavigation();
  const {
    colors: { surface: surfaceColor },
  } = useTheme();

  // const {
  //   post: { postId, postedUserId },
  // } = route.params as { post: Amity.Post };

  // useEffect(() => {
  //   return observeUser(postedUserId, ({ data }) => {
  //     console.log({ data });
  //     // setUser(a);
  //   });
  // }, [postedUserId]);

  const getCurrentPost = useCallback(async () => {
    // runQuery(createQuery(getPost, postId), ({ data, error }) => {
    //   if (data) {
    //     if (data.isDeleted) {
    //       navigation.goBack();
    //     } else {
    //       setPost(data);
    //     }
    //   } else if (error) {
    //     alertError(error, () => {
    //       navigation.goBack();
    //     });
    //   }
    // });
  }, []);

  useEffect(() => {
    getCurrentPost();
  }, [getCurrentPost]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user?.data?.displayName ? `${user.data.displayName}'s Post` : 'Post',
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
  }, [navigation]);

  const onCloseAddPost = useCallback(() => {
    setIsEditId('');
  }, []);

  const onEditPost = useCallback(() => {
    // setIsEditId(postId);
  }, []);

  const targetId = client.userId ?? '';

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: surfaceColor }}
    >
      {!post?.postId ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <React.Fragment>
          <PostItem post={post} onEditPost={onEditPost} />

          {/* <Comments postId={postId} /> */}

          {isEditId !== '' && (
            <AddPost
              isEditId={isEditId}
              targetType="user"
              targetId={targetId}
              onClose={onCloseAddPost}
            />
          )}
        </React.Fragment>
      )}
    </KeyboardAwareScrollView>
  );
};

export default PostScreen;
