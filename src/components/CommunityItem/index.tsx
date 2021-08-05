import Moment from 'moment';
import React, { VFC, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { leaveCommunity, joinCommunity } from '@amityco/ts-sdk';
import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { Text, Card, Paragraph, Button, useTheme } from 'react-native-paper';

import { t } from 'i18n';
import handleError from 'utils/handleError';

import { CommunityItemProps } from 'types';

const CommunityItem: VFC<CommunityItemProps> = ({
  createdAt,
  isJoined,
  communityId,
  displayName,
  membersCount,
  description,
  postsCount,
  onRefresh,
  onPress,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    colors: { text: textColor },
  } = useTheme();

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
    <Card onPress={onPress}>
      <Card.Title
        title={displayName}
        subtitle={
          <View style={styles.subtitle}>
            <Text style={styles.subtitleRow}>
              {communityCreateAt} / {`${t('by')} ${displayName}`}
            </Text>
          </View>
        }
      />

      <Card.Content>
        <Paragraph style={styles.text}>{description}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.footer}>
        <View style={styles.footerLeft}>
          <View style={styles.subtitleRow}>
            <MaterialCommunityIcons size={18} name="account-group" color={textColor} />
            <Text>{membersCount}</Text>
          </View>
          <View style={styles.subtitleRow}>
            <MaterialCommunityIcons size={18} name="note-text-outline" color={textColor} />
            <Text>{postsCount}</Text>
          </View>
        </View>

        <Pressable style={styles.footerRight} onPress={onToggleJoinCommunity}>
          <Button compact mode="outlined" loading={loading} disabled={loading}>
            {isJoined ? t('leave') : t('join')}
          </Button>
        </Pressable>
      </Card.Actions>
    </Card>
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
});
