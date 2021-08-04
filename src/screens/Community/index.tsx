/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Moment from 'moment';
import React, { VFC, useState, useEffect, useLayoutEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackHeaderProps } from '@react-navigation/stack';
import { Pressable, View, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Text, Card, Paragraph } from 'react-native-paper';
import { observeUser, queryPosts, leaveCommunity, joinCommunity } from '@amityco/ts-sdk';

import { Header } from 'components';

import { t } from 'i18n';
import handleError from 'utils/handleError';

import { CommentSortBy, PostFeedType, CommunityProps } from 'types';

import Feeds from './Feeds';

const Community: VFC = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState<ASC.Post[]>();
  const [community, setCommunity] = useState<ASC.Community>();
  const [sortBy, setSortBy] = React.useState<CommentSortBy>(CommentSortBy.LAST_CREATED);
  const [feedType, setFeedType] = React.useState<PostFeedType>(PostFeedType.PUBLISHED);

  const route = useRoute();
  const navigation = useNavigation();

  const {
    communityId,
    userId,
    displayName,
    membersCount,
    postsCount,
    createdAt,
    isJoined,
    onRefresh,
  } = route.params as CommunityProps & { onRefresh: () => void };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: displayName ? `${displayName}'s Commuity` : 'Commuity',
      header: ({ scene, previous, navigation: nav }: StackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayName]);

  useEffect(() => {
    if (communityId) {
      observeUser(userId, setUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId]);

  const onToggleJoinCommunity = async () => {
    setLoading(true);
    try {
      const api = isJoined ? leaveCommunity : joinCommunity;
      // console.log(1, communityId);

      await api(communityId);
      onRefresh();
    } catch (error) {
      // console.log(3, error);
      const errorText = handleError(error);

      Alert.alert(errorText);
    } finally {
      setLoading(false);
    }
  };

  const communityCreateAt = Moment(createdAt).format('HH:mm, MMM d');

  return (
    <View>
      <Card>
        <Card.Title
          title={displayName}
          subtitle={
            <View style={styles.subtitle}>
              <View style={styles.subtitleRow}>
                <MaterialCommunityIcons size={18} name="account-group" />
                <Text>{membersCount}</Text>
              </View>
              <View style={styles.subtitleRow}>
                <MaterialCommunityIcons size={18} name="note-text-outline" />
                <Text>{postsCount}</Text>
              </View>

              <Text style={styles.subtitleRow}>{communityCreateAt}</Text>
            </View>
          }
        />
        <Card.Content>
          <Paragraph style={styles.text}>{displayName}</Paragraph>
        </Card.Content>
        <Card.Actions style={styles.footer}>
          <View style={styles.footerLeft}>
            <Paragraph style={styles.text}>by {displayName}</Paragraph>
          </View>
          <Pressable style={styles.footerRight} onPress={onToggleJoinCommunity}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.footerBtn}>{isJoined ? t('leave') : t('join')}</Text>
            )}
          </Pressable>
        </Card.Actions>
      </Card>

      <Feeds communityId={communityId} />
    </View>
  );
};

export const styles = StyleSheet.create({
  subtitle: { flexDirection: 'row', width: '100%' },
  subtitleRow: { flexDirection: 'row', marginEnd: 10, justifyContent: 'center' },
  text: { marginBottom: 10 },
  footer: { justifyContent: 'space-between' },
  footerLeft: { flexDirection: 'row' },
  footerRight: { flexDirection: 'row', paddingEnd: 10 },
  footerBtn: { marginStart: 10 },
});

export default Community;
