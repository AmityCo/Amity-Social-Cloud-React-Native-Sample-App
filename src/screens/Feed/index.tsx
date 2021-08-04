/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { queryPosts } from '@amityco/ts-sdk';
import { FlatList, StyleSheet, View } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import React, { VFC, useState, useLayoutEffect, useEffect } from 'react';
import { Surface, Appbar, Button, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Header, FAB, EmptyComponent, AddPost, PostItem } from 'components';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import handleError from 'utils/handleError';

import { PostFeedType, PostFeedTypeeee, PostSortBy } from 'types';

import FilterDialog from './FilterDialog';

const FeedScreen: VFC = () => {
  const [error, setError] = useState('');
  const [isEditId, setIsEditId] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<ASC.Post[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [targetType] = React.useState<ASC.PostTargetType>('user');
  const [feedType] = React.useState<PostFeedType>(PostFeedType.PUBLISHED);
  const [isDeleted, setIsDeleted] = React.useState<ASC.Post['isDeleted']>(false);
  const [sortBy, setSortBy] = React.useState<PostSortBy>(PostSortBy.LAST_CREATED);
  const [feedTypeee, setFeedTypeee] = React.useState<PostFeedTypeeee>(PostFeedTypeeee.Normal);

  const { client } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, previous, navigation: nav }: StackHeaderProps) => (
        <Header
          scene={scene}
          navigation={nav}
          previous={previous}
          right={<Appbar.Action icon="filter" onPress={() => setShowDialog(true)} />}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // setPosts([]);

    onQueryPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, isDeleted]);

  // TODO what if there is no client.userId? try for userIsDisconnected // try for reproduce
  const onQueryPost = async () => {
    if (!client.userId) {
      setError('UserId is not reachable!');
    }

    setError('');
    setLoading(true);

    try {
      const query = {
        sortBy,
        feedType,
        isDeleted,
        targetType,
        targetId: client.userId!,
      };

      const result = await queryPosts(query);

      setPosts(result);
    } catch (e) {
      const errorText = handleError(e);

      setError(errorText);
    } finally {
      setLoading(false);
    }
  };

  const data =
    posts?.map(post => ({
      ...post,
      onPress: () => {
        navigation.navigate('Post', { ...post, onRefresh: onQueryPost });
      },
    })) ?? [];

  return (
    <Surface style={styles.container}>
      {error !== '' ? (
        <View>
          <HelperText type="error" style={styles.errorText}>
            {error}
          </HelperText>
          <Button onPress={onQueryPost}>{t('retry')}</Button>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={post => post.postId}
          renderItem={({ item }) => (
            <Surface style={styles.postItem}>
              <PostItem {...item} onRefresh={onQueryPost} onEditPost={setIsEditId} />
            </Surface>
          )}
          ListEmptyComponent={<EmptyComponent loading={loading} errorText={t('posts.no_result')} />}
        />
      )}

      <AddPost
        onClose={() => {
          setIsEditId('');
          setShowAddPost(false);
        }}
        isEditId={isEditId}
        onAddPost={onQueryPost}
        visible={showAddPost || isEditId !== ''}
      />

      <FAB
        icon="plus"
        onPress={() => {
          setShowAddPost(true);
        }}
      />

      <FilterDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        isDeleted={isDeleted}
        setIsDeleted={setIsDeleted}
        sortBy={sortBy}
        setSortBy={setSortBy}
        feedTypeee={feedTypeee}
        setFeedTypeee={setFeedTypeee}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postItem: {
    flex: 1,
    margin: 12,
    borderRadius: 5,
  },
  errorText: { fontSize: 18, alignSelf: 'center', marginTop: 25, marginBottom: 15 },
});

export default FeedScreen;
