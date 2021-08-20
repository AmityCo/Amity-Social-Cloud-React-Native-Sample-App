import { StyleSheet } from 'react-native';
import { Surface, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useLayoutEffect } from 'react';

import { Header, FAB, AddPost, Feed } from 'components';

import useAuth from 'hooks/useAuth';

import { PostFeedType, FeedType, PostSortBy, DrawerStackHeaderProps, LoadingState } from 'types';

import FilterDialog from './FilterDialog';

const FeedScreen: VFC = () => {
  const [isEditId, setIsEditId] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [feedType, setFeedType] = React.useState<FeedType>(FeedType.Normal);
  const [postFeedType] = React.useState<PostFeedType>(PostFeedType.PUBLISHED);
  const [sortBy, setSortBy] = React.useState<PostSortBy>(PostSortBy.LAST_CREATED);
  const [isDeleted, setIsDeleted] = React.useState<Amity.Post['isDeleted']>(false);

  const { client } = useAuth();
  const navigation = useNavigation();

  if (!client.userId) {
    throw Error('not connected!');
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header
          scene={scene}
          navigation={nav}
          previous={previous}
          right={<Appbar.Action icon="filter" onPress={() => setShowDialog(true)} />}
        />
      ),
    });
  }, [navigation]);

  return (
    <Surface style={styles.container}>
      <Feed
        sortBy={sortBy}
        targetType="user"
        feedType={feedType}
        isDeleted={isDeleted}
        targetId={client.userId}
        postFeedType={postFeedType}
      />

      <AddPost
        onClose={() => {
          setIsEditId('');
          setShowAddPost(false);
        }}
        targetType="user"
        isEditId={isEditId}
        targetId={client.userId}
        visible={showAddPost || isEditId !== ''}
      />

      <FAB
        icon="plus"
        onPress={() => {
          setShowAddPost(true);
        }}
      />

      <FilterDialog
        sortBy={sortBy}
        feedType={feedType}
        setSortBy={setSortBy}
        isDeleted={isDeleted}
        showDialog={showDialog}
        setFeedType={setFeedType}
        setIsDeleted={setIsDeleted}
        setShowDialog={setShowDialog}
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
