/* eslint-disable react/jsx-props-no-spreading */
import { Surface } from 'react-native-paper';
import { queryPosts } from '@amityco/ts-sdk';
import { StyleSheet, FlatList } from 'react-native';
import { EmptyComponent, PostItem } from 'components';
import React, { VFC, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import handleError from 'utils/handleError';

type CommentsType = Pick<ASC.User, 'userId'>;

const Feeds: VFC<CommentsType> = ({ userId }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState<ASC.Post[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    onQueryFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onQueryFeed = async () => {
    setLoading(true);
    try {
      const query = {
        targetType: 'user',
        targetId: userId,
      };

      const result = await queryPosts(query);

      setFeed(result);
    } catch (e) {
      const errorText = handleError(e);

      setError(errorText);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    onQueryFeed();
  };

  const data =
    feed.length > 0
      ? feed.map(post => ({
          ...post,
          onPress: () => {
            navigation.navigate('Post', { ...post, onRefresh: onQueryFeed });
          },
        }))
      : [];

  return (
    <FlatList
      data={data}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.postId}
      renderItem={({ item }) => (
        <Surface style={styles.postItem}>
          <PostItem key={item.postId} {...item} onRefresh={onRefresh} />
        </Surface>
      )}
      ListEmptyComponent={<EmptyComponent loading={loading} errorText={error} />}
    />
  );
};

const styles = StyleSheet.create({
  isLoadingOrEmpty: { padding: 20 },
  helperText: { textAlign: 'center', padding: 20, marginTop: 20 },
  list: { margin: 5 },
  text: { marginBottom: 10 },
  postItem: {
    flex: 1,
    margin: 12,
    borderRadius: 5,
  },
});

export default Feeds;
