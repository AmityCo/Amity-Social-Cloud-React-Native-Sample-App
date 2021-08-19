/* eslint-disable consistent-return */
import Moment from 'moment';
import React, { VFC, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Pressable, StyleSheet, Alert } from 'react-native';
import {
  leaveCommunity,
  joinCommunity,
  observeUser,
  getCommunity,
  deleteCommunity,
} from '@amityco/ts-sdk';
import { Text, Card, Paragraph, Button, useTheme } from 'react-native-paper';
import { observeCommunity } from '@amityco/ts-sdk/community/observers/observeCommunity';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import handleError from 'utils/handleError';

import { CommunityItemProps } from 'types';

import CardTitle from '../CardTitle';
import HeaderMenu from '../HeaderMenu';

const CommunityItem: VFC<{ community: Amity.Community } & CommunityItemProps> = ({
  community: communityProp,
  onPress,
  onEditCommunity,
}) => {
  const [user, setUser] = useState<Amity.User>();
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [community, setCommunity] = useState<Amity.Community>();

  const { communityId, userId } = communityProp;

  const { client } = useAuth();
  const {
    colors: { text: textColor },
  } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    return observeUser(userId, ({ data: updatedUser }) => {
      setUser(updatedUser);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    getCurrentCommunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId]);

  const getCurrentCommunity = async () => {
    try {
      const currentCommunity = await getCommunity(communityId);

      setCommunity(currentCommunity);
    } catch (error) {
      const errorText = handleError(error);
      Alert.alert(
        'Oooops!',
        errorText,
        [
          {
            text: t('close'),
            onPress: async () => {
              if (!onPress) {
                navigation.goBack();
              }
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  useEffect(
    () => {
      return observeCommunity(communityId, updatedCommunity => {
        setCommunity(updatedCommunity.data);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [communityId],
  );

  const onToggleJoinCommunity = async () => {
    setLoading(true);
    try {
      const api = community?.isJoined ? leaveCommunity : joinCommunity;

      await api(communityId);
    } catch (error) {
      const errorText = handleError(error);

      Alert.alert(errorText);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = () => {
    setOpenMenu(false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    onEditCommunity!(communityId);
  };

  const onDelete = () => {
    Alert.alert(
      t('are_you_sure'),
      '',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('ok'),
          onPress: async () => {
            try {
              setOpenMenu(false);

              await deleteCommunity(communityId);

              if (!onPress) {
                navigation.goBack();
              }
            } catch (error) {
              const errorText = handleError(error);

              Alert.alert(errorText);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const communityCreateAt = Moment(community?.createdAt).format('HH:mm, MMM d');

  const isUser = client.userId === userId;
  const canEdit = isUser && onEditCommunity ? onEdit : undefined;
  const canDelete = isUser ? onDelete : undefined;

  return (
    <Card onPress={!community?.isDeleted ? onPress : undefined}>
      <Card.Title
        title={<CardTitle title={community?.displayName} isDeleted={community?.isDeleted} />}
        subtitle={
          <View style={styles.subtitle}>
            <Text style={styles.subtitleRow}>
              {communityCreateAt} / {`${t('by')} ${user?.displayName ?? userId}`}
            </Text>
          </View>
        }
        right={({ size }) =>
          !community?.isDeleted ? (
            <HeaderMenu
              size={size}
              onEdit={canEdit}
              visible={openMenu}
              onDelete={canDelete}
              onToggleMenu={() => setOpenMenu(prev => !prev)}
            />
          ) : undefined
        }
      />

      <Card.Content>
        <Paragraph style={styles.text}>{community?.description}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.footer}>
        <View style={styles.footerLeft}>
          <View style={styles.subtitleRow}>
            <MaterialCommunityIcons size={18} name="account-group" color={textColor} />
            <Text>{community?.membersCount}</Text>
          </View>
          <View style={styles.subtitleRow}>
            <MaterialCommunityIcons size={18} name="note-text-outline" color={textColor} />
            <Text>{community?.postsCount}</Text>
          </View>
        </View>

        {!community?.isDeleted && (
          <Pressable style={styles.footerRight} onPress={onToggleJoinCommunity}>
            <Button compact mode="outlined" loading={loading} disabled={loading}>
              {community?.isJoined ? t('leave') : t('join')}
            </Button>
          </Pressable>
        )}
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
