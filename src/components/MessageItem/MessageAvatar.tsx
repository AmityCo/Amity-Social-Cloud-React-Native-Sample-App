import { Avatar } from 'react-native-paper';
import { observeFile } from '@amityco/ts-sdk';
import React, { VFC, useState, useEffect } from 'react';

import { messageStyles } from './styles';

const MessageItem: VFC<{ user: Amity.User }> = ({ user }) => {
  const [avatar, setAvatar] = useState<Amity.File>();

  useEffect(() => {
    if (user?.avatarFileId) {
      return observeFile(user.avatarFileId, ({ data }) => {
        setAvatar(data);
      });
    }

    return undefined;
  }, [user]);

  return avatar?.fileUrl ? (
    <Avatar.Image source={{ uri: avatar?.fileUrl }} style={messageStyles.avatar} size={40} />
  ) : (
    <Avatar.Text
      size={40}
      style={messageStyles.avatar}
      label={user?.displayName?.slice(0, 2).toUpperCase() ?? ''}
    />
  );
};

export default MessageItem;
