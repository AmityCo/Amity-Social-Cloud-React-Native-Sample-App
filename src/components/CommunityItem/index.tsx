import { format } from 'date-fns';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  onEditCommunity: (communityId: string) => void;
};

const CommunityItem: VFC<{ community: Amity.Community } & CommunityItemProps> = ({
  community: communityProp,
  onPress,
  onEditCommunity,
}) => {
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

  const onEdit = () => {
    setOpenMenu(false);

    onEditCommunity(communityId);
  };

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
