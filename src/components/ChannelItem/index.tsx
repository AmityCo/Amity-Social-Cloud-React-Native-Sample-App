import { format } from 'date-fns';
import { View } from 'react-native';
import { observeChannel } from '@amityco/ts-sdk';
import React, { VFC, useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Card, Paragraph, useTheme } from 'react-native-paper';

import CardTitle from '../CardTitle';
import HeaderMenu from '../HeaderMenu';

import styles from './styles';

export type ChannelItemProps = {
  onPress?: () => void;
};

const ChannelItem: VFC<{ channel: Amity.Channel } & ChannelItemProps> = ({
  channel: channelProp,
  onPress,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [channel, setChannel] = useState<Amity.Channel>();

  const { channelId, createdAt } = channelProp;

  const {
    colors: { text: textColor },
  } = useTheme();

  useEffect(() => {
    return observeChannel(channelId, ({ data }) => {
      setChannel(data);
    });
  }, [channelId]);

  const channelCreateAt = format(new Date(channel?.createdAt ?? createdAt), 'HH:mm, MMM d');

  return (
    <Card onPress={!channel?.isDeleted ? onPress : undefined}>
      <Card.Title
        title={
          <CardTitle
            title={channel?.displayName ?? channel?.channelId}
            isDeleted={channel?.isDeleted}
          />
        }
        subtitle={
          <View style={styles.subtitle}>
            <Text style={styles.subtitleRow}>{channelCreateAt}</Text>
          </View>
        }
        right={({ size }) =>
          !channel?.isDeleted ? (
            <HeaderMenu
              size={size}
              visible={openMenu}
              onToggleMenu={() => setOpenMenu(prev => !prev)}
            />
          ) : undefined
        }
      />

      <Card.Content>
        <Paragraph style={styles.text}>{channel?.description}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.footer}>
        <View style={styles.footerLeft}>
          <View style={styles.subtitleRow}>
            <MaterialCommunityIcons size={18} name="account-group" color={textColor} />
            <Text>{channel?.memberCount}</Text>
          </View>
          <View style={styles.subtitleRow}>
            <MaterialCommunityIcons size={18} name="note-text-outline" color={textColor} />
            <Text>{channel?.messageCount}</Text>
          </View>
        </View>
      </Card.Actions>
    </Card>
  );
};

export default ChannelItem;
