import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { View, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { VFC, useState, useEffect, useCallback } from 'react';
import {
  leaveCommunity,
  joinCommunity,
  observeUser,
  deleteCommunity,
  runQuery,
  createQuery,
  observeCommunity,
  // subscribeTopic,
  // getCommunityTopic,
} from '@amityco/ts-sdk';
import { Text, Card, Paragraph, Button, useTheme } from 'react-native-paper';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import { alertError, alertConfirmation } from 'utils/alerts';

import CardTitle from '../CardTitle';
import HeaderMenu from '../HeaderMenu';

import styles from './styles';

export type CommunityItemProps = {
  onPress?: () => void;
  onEditCommunity?: (communityId: string) => void;
};

const CommunityItem: VFC<
  { community: Amity.Community; subscribable?: boolean; a?: string } & CommunityItemProps
> = ({ community: communityProp, onPress, subscribable = false }) => {
  const [user, setUser] = useState<Amity.User>();
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [community, setCommunity] = useState<Amity.Community>();

  const { communityId, userId, createdAt } = communityProp;

  const { client } = useAuth();
  const {
    colors: { text: textColor },
  } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    return observeUser(userId, ({ data: updatedUser }) => {
      setUser(updatedUser);
    });
  }, [userId]);

  useEffect(() => {
    return observeCommunity(communityId, updatedCommunity => {
      setCommunity(updatedCommunity.data);
    });
  }, [communityId]);

  // useEffect(() => {
  //   if (!community?.path || !subscribable) {
  //     return;
  //   }

  //   // eslint-disable-next-line consistent-return
  //   return subscribeTopic(getCommunityTopic(community));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [community?.path]);

  const onToggleJoinCommunity = async () => {
    setLoading(true);
    const api = community?.isJoined ? leaveCommunity : joinCommunity;

    runQuery(createQuery(api, communityId), ({ loading: loading_, error }) => {
      setLoading(!!loading_);

      if (error) {
        alertError(error);
      }
    });
  };

  // const onEdit = () => {
  //   setOpenMenu(false);

  //   onEditCommunity(communityId);
  // };

  const onDelete = useCallback(() => {
    alertConfirmation(() => {
      setOpenMenu(false);

      runQuery(createQuery(deleteCommunity, communityId), ({ data, error }) => {
        if (data && !onPress) {
          navigation.goBack();
        } else if (error) {
          alertError(error);
        }
      });
    });
  }, [communityId, navigation, onPress]);

  const communityCreateAt = format(new Date(community?.createdAt ?? createdAt), 'HH:mm, MMM d');

  const isUser = client.userId === userId;
  // const canEdit = isUser && onEditCommunity ? onEdit : undefined;
  const canDelete = isUser ? onDelete : undefined;

  return (
    <Card onPress={!community?.isDeleted ? onPress : undefined}>
      <Card.Title
        title={<CardTitle title={community?.displayName} isDeleted={community?.isDeleted} />}
        subtitle={
          <View style={styles.subtitle}>
            <Text style={styles.subtitleRow}>
              {communityCreateAt} / {`${t('by')} ${user?.displayName ?? userId}`}
              {community?.membersCount && (
                <Text>
                  {` / ${community.isPublic ? t('community.public') : t('community.private')}`}
                </Text>
              )}
            </Text>
          </View>
        }
        right={({ size }) =>
          !community?.isDeleted ? (
            <HeaderMenu
              size={size}
              // onEdit={canEdit}
              visible={openMenu}
              onDelete={canDelete}
              onToggleMenu={() => setOpenMenu(prev => !prev)}
            />
          ) : undefined
        }
      />

      <Card.Content>
        <ScrollView style={styles.content}>
          <Paragraph style={styles.text}>{community?.description}</Paragraph>
        </ScrollView>
      </Card.Content>

      <Card.Actions
        key={`Actions_${community?.membersCount}_${community?.postsCount}`}
        style={styles.footer}
      >
        <View style={styles.footerLeft}>
          <View style={styles.subtitleRow}>
            <MaterialCommunityIcons size={18} name="account-group" color={textColor} />
            {!!community && <Text>{String(community?.membersCount ?? 0)}</Text>}
          </View>
          <View style={styles.subtitleRow}>
            <MaterialCommunityIcons size={18} name="note-text-outline" color={textColor} />
            {!!community && <Text>{String(community?.postsCount ?? 0)}</Text>}
          </View>
        </View>

        {!community?.isDeleted && !isUser && (
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
