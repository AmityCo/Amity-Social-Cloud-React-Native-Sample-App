/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { queryPosts } from '@amityco/ts-sdk';
import { FlatList, StyleSheet, View } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import React, { VFC, useState, useLayoutEffect, useEffect } from 'react';
import {
  Surface,
  Appbar,
  Button,
  Divider,
  RadioButton,
  Portal,
  Dialog,
  Title,
  Switch,
  Text,
  TouchableRipple,
  HelperText,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// import { StackNavigationProp } from '@react-navigation/stack';
import { Header, FAB, EmptyComponent } from 'components';

// import Twitt from 'components/Twitt';
// import { twitts } from 'constants/data';
import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import handleError from 'utils/handleError';

import { PostFeedType, PostFeedTypeeee, PostSortBy, PostProps } from 'types';

import PostItem from './PostItem';

const FeedScreen: VFC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<ASC.Post[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleted, setIsDeleted] = React.useState<ASC.Post['isDeleted']>(false);
  const [targetType, setTargetType] = React.useState<ASC.PostTargetType>('user');
  const [sortBy, setSortBy] = React.useState<PostSortBy>(PostSortBy.FIRST_CREATED);
  const [feedType, setFeedType] = React.useState<PostFeedType>(PostFeedType.PUBLISHED);
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

  const data = posts.map(post => ({
    ...post,
    onPress: () => {
      navigation.navigate('Details', { ...post });
    },
  }));

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
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderItem={({ item }) => <PostItem {...item} onRefresh={onQueryPost} />}
          ListEmptyComponent={<EmptyComponent loading={loading} errorText={t('posts.no_result')} />}
        />
      )}

      <FAB
        icon="plus"
        onPress={() => {
          //
        }}
      />

      <Portal>
        <Dialog visible={showDialog} dismissable={false}>
          <Dialog.Content>
            <Title>{t('posts.feed_type')}</Title>
            <TouchableRipple
              rippleColor="transparent"
              style={styles.radioArea}
              onPress={() => setFeedTypeee(PostFeedTypeeee.Normal)}
            >
              <>
                <Text>{t(`posts.feed_type_${PostFeedTypeeee.Normal}`)}</Text>
                <RadioButton
                  value={PostFeedTypeeee.Normal}
                  status={feedTypeee === PostFeedTypeeee.Normal ? 'checked' : 'unchecked'}
                  onPress={() => setFeedTypeee(PostFeedTypeeee.Normal)}
                />
              </>
            </TouchableRipple>
            <TouchableRipple
              rippleColor="transparent"
              style={styles.radioArea}
              onPress={() => setFeedTypeee(PostFeedTypeeee.Global)}
            >
              <>
                <Text>{t(`posts.feed_type_${PostFeedTypeeee.Global}`)}</Text>
                <RadioButton
                  value={PostFeedTypeeee.Global}
                  status={feedTypeee === PostFeedTypeeee.Global ? 'checked' : 'unchecked'}
                  onPress={() => setFeedTypeee(PostFeedTypeeee.Global)}
                />
              </>
            </TouchableRipple>

            <Divider style={styles.divider} />

            <Title>{t('posts.sort_by')}</Title>
            <TouchableRipple
              rippleColor="transparent"
              style={styles.radioArea}
              onPress={() => setSortBy(PostSortBy.FIRST_CREATED)}
            >
              <>
                <Text>{t(`posts.sort_by_${PostSortBy.FIRST_CREATED}`)}</Text>
                <RadioButton
                  value={PostSortBy.FIRST_CREATED}
                  status={sortBy === PostSortBy.FIRST_CREATED ? 'checked' : 'unchecked'}
                  onPress={() => setSortBy(PostSortBy.FIRST_CREATED)}
                />
              </>
            </TouchableRipple>
            <TouchableRipple
              rippleColor="transparent"
              style={styles.radioArea}
              onPress={() => setSortBy(PostSortBy.LAST_CREATED)}
            >
              <>
                <Text>{t(`posts.sort_by_${PostSortBy.LAST_CREATED}`)}</Text>
                <RadioButton
                  value={PostSortBy.LAST_CREATED}
                  status={sortBy === PostSortBy.LAST_CREATED ? 'checked' : 'unchecked'}
                  onPress={() => setSortBy(PostSortBy.LAST_CREATED)}
                />
              </>
            </TouchableRipple>

            <Divider style={styles.divider} />

            <TouchableRipple
              rippleColor="transparent"
              style={[styles.radioArea, styles.includeDeletedArea]}
              onPress={() => setIsDeleted(status => !status)}
            >
              <>
                <Text>{t('posts.include_deleted')}</Text>
                <Switch value={isDeleted} onValueChange={() => setIsDeleted(status => !status)} />
              </>
            </TouchableRipple>

            <Dialog.Actions>
              <Button onPress={() => setShowDialog(false)}>{t('close')}</Button>
            </Dialog.Actions>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  radioArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: { marginBottom: 25 },
  includeDeletedArea: {
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: { fontSize: 18, alignSelf: 'center', marginTop: 25, marginBottom: 15 },
});

export default FeedScreen;
