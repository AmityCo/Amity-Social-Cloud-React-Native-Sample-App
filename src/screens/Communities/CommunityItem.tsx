import Moment from 'moment';
import React, { VFC, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { leaveCommunity, joinCommunity } from '@amityco/ts-sdk';
import { Surface, Text, Card, Paragraph } from 'react-native-paper';
import { View, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';

import { t } from 'i18n';
import handleError from 'utils/handleError';

import { CommunityProps } from 'types';

type CommunityItemProps = CommunityProps & { onRefresh: () => void };

const CommunityItem: VFC<CommunityItemProps> = ({
  createdAt,
  isJoined,
  communityId,
  displayName,
  membersCount,
  postsCount,
  onRefresh,
  onPress,
}) => {
  const [loading, setLoading] = useState(false);

  const onToggleJoinCommunity = async () => {
    setLoading(true);
    try {
      const api = isJoined ? leaveCommunity : joinCommunity;

      await api(communityId);
      onRefresh();
    } catch (error) {
      const errorText = handleError(error);

      Alert.alert(errorText);
    } finally {
      setLoading(false);
    }
  };

  const communityCreateAt = Moment(createdAt).format('HH:mm, MMM d');

  return (
    <Surface style={styles.container}>
      <Card onPress={onPress}>
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
    </Surface>
  );
};

export default CommunityItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
    borderRadius: 5,
  },
  subtitle: { flexDirection: 'row', width: '100%' },
  subtitleRow: { flexDirection: 'row', marginEnd: 10, justifyContent: 'center' },
  text: { marginBottom: 10 },
  footer: { justifyContent: 'space-between' },
  footerLeft: { flexDirection: 'row' },
  footerRight: { flexDirection: 'row', paddingEnd: 10 },
  footerBtn: { marginStart: 10 },
});
