import React, { VFC, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText, ActivityIndicator, Card, Paragraph } from 'react-native-paper';
import { queryPosts } from '@amityco/ts-sdk';

type CommentsType = Pick<ASC.Community, 'communityId'>;

const Feeds: VFC<CommentsType> = ({ communityId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [feed, setFeed] = useState<ASC.Post[]>([]);

  useEffect(() => {
    onQueryFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onQueryFeed = async () => {
    try {
      const query = {
        targetType: 'community',
        targetId: communityId,
      };

      const result = await queryPosts(query);

      setFeed(result);
    } catch (e) {
      // const errorText = handleError(e);
      // setError(errorText);
    }
  };

  const isLoadingOrEmpty = isLoading || (!isLoading && !feed.length);

  return (
    <View>
      {isLoadingOrEmpty ? (
        <View style={styles.isLoadingOrEmpty}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <HelperText type="info" style={styles.helperText}>
              No Comments, write the first!
            </HelperText>
          )}
        </View>
      ) : (
        feed.map(post => (
          <Card style={styles.list}>
            <Card.Title title={post.data.text} />
            <Card.Content>
              <Paragraph style={styles.text}>{post.data.text}</Paragraph>
            </Card.Content>
          </Card>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  isLoadingOrEmpty: { padding: 20 },
  helperText: { textAlign: 'center', padding: 20, marginTop: 20 },
  list: { margin: 5 },
  text: { marginBottom: 10 },
});

export default Feeds;
