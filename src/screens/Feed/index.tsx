import { Surface, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useLayoutEffect, useCallback } from 'react';

import { Header, FAB, AddPost, Feed } from 'components';

import useAuth from 'hooks/useAuth';

import { PostFeedType, FeedTargetType, DrawerStackHeaderProps } from 'types';

import FilterDialog from './FilterDialog';

import styles from './styles';

const FeedScreen: VFC = () => {
  const [isEditId, setIsEditId] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [useCustomRanking, setUseCustomRanking] = React.useState(false);
  const [postFeedType] = React.useState<PostFeedType>(PostFeedType.PUBLISHED);
  const [isDeleted, setIsDeleted] = React.useState<Amity.Post['isDeleted']>(false);
  const [feedTargetType, setFeedTargetType] = React.useState<FeedTargetType>(FeedTargetType.Normal);

  const { client } = useAuth();
  const navigation = useNavigation();

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

  const onCloseAddPost = useCallback(() => {
    setIsEditId('');
    setShowAddPost(false);
  }, []);

  const onFABPress = useCallback(() => {
    setShowAddPost(true);
  }, []);

  const targetId = client.userId ?? '';
  const showAddPostModal = showAddPost || isEditId !== '';

  return (
    <Surface style={styles.container}>
      <Feed
        targetType="user"
        isDeleted={isDeleted}
        targetId={targetId}
        postFeedType={postFeedType}
        feedTargetType={feedTargetType}
        useCustomRanking={useCustomRanking}
      />

      {showAddPostModal && (
        <AddPost
          targetType="user"
          isEditId={isEditId}
          targetId={targetId}
          onClose={onCloseAddPost}
        />
      )}

      <FAB icon="plus" onPress={onFABPress} />

      {showDialog && (
        <FilterDialog
          isDeleted={isDeleted}
          setIsDeleted={setIsDeleted}
          setShowDialog={setShowDialog}
          targetFeedType={feedTargetType}
          setTargetFeedType={setFeedTargetType}
          useCustomRanking={useCustomRanking}
          setCustomRanking={setUseCustomRanking}
        />
      )}
    </Surface>
  );
};

export default FeedScreen;
